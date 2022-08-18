<template lang="html">
  <b-container>
    <portal to="pageTitle">Releases</portal>

    <portal to="headerActions">
      <b-button
        url="https://github.com/romancm/gamebrary"
        variant="light"
        target="_blank"
        class="mr-2"
      >
        <i class="fab fa-github fa-fw" aria-hidden />
        View in GitHub
      </b-button>
    </portal>

    <b-card
      v-for="release in releases"
      :key="release.id"
      hide-footer
      class="mb-3"
    >
      <template v-slot:header>
        <h3 class="mb-0">
          <b-badge>{{ release.tag_name }}</b-badge>
          {{ release.name }}
        </h3>
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
    ...mapState(['releases', 'notification', 'settings', 'user']),
  },

  async mounted() {
    if (!this.user) await this.$store.dispatch('LOAD_RELEASES');

    const [latestRelease] = this.releases;

    if (this.notification && latestRelease?.tag_name) {
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
