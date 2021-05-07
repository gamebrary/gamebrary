<template lang="html">
  <b-container>
    <page-title
      title="Releases"
    />

    <portal to="dock">
      <b-button
        href="https://github.com/romancm/gamebrary"
        target="_blank"
      >
        <i class="fab fa-github fa-fw" aria-hidden />
        View in GitHub
      </b-button>
    </portal>

    <b-card
      bg-variant="secondary"
      header-bg-variant="secondary"
      v-for="release in releases"
      :key="release.id"
      hide-footer
      class="mb-3"
    >
      <template v-slot:header>
        <h6 class="mb-0">
          <b-badge>{{ release.tag_name }}</b-badge>
          {{ release.name }}
        </h6>
      </template>

      <b-card-text>
        <small class="text-muted">
          {{ $t('releases.published') }} {{ formatDate(release.published_at) }}
        </small>

        <vue-markdown :source="release.body" class="w-100 releases" />
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },

  computed: {
    ...mapState(['releases', 'notification', 'settings']),
  },

  mounted() {
    const [latestRelease] = this.releases;

    if (this.notification && latestRelease && latestRelease.tag_name) {
      this.$store.commit('UPDATE_SETTING', { key: 'release', value: latestRelease.tag_name });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .then(() => {
          this.$store.commit('SET_NOTIFICATION', false);
        })
        .catch(() => {
          this.$bvToast.toast(
            'There was an error saving your settings',
            { title: 'Error', variant: 'danger' });
        });
    }
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },
  },
};
</script>
