<template lang="html">
  <b-container fluid>
    <page-title
      title="Releases"
    >
      <b-button
        href="https://github.com/romancm/gamebrary"
        target="_blank"
      >
        <i class="fab fa-github fa-fw" aria-hidden />
        View in GitHub
      </b-button>
    </page-title>

    <b-card
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

        <div class="w-100 releases" v-html="$options.marked(release.body)" />
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { marked } from 'marked';

export default {
  marked,

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
