<template lang="html">
  <div class="mx-2">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">
        Releases
      </h3>
    </div>

    <portal to="dock">
      <b-button
        href="https://github.com/romancm/gamebrary"
        target="_blank"
        :variant="darkTheme ? 'dark' : 'primary'"
      >
        <i class="fab fa-github fa-fw" aria-hidden />
        View in GitHub
      </b-button>
    </portal>

    <b-card
      v-for="release in releases"
      :key="release.id"
      :bg-variant="darkTheme ? 'dark' : null"
      :text-variant="darkTheme ? 'white' : null"
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },

  computed: {
    ...mapState(['releases', 'notification', 'settings']),
    ...mapGetters(['darkTheme']),
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
