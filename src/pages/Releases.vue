<template lang="html">
  <div>
    <b-jumbotron
      header="Releases"
      header-level="5"
      fluid
      lead="Select a theme below"
    />

    <b-container>
      <b-row>
        <b-col>
          <b-list-group>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
              v-for="release in releases"
              :key="release.id"
              :active="selectedRelease && release.id === selectedRelease.id"
              @click="selectedRelease = release"
            >
              <h6 class="m-0">
                <b-badge>{{ release.tag_name }}</b-badge>
                {{ release.name }}
              </h6>
            </b-list-group-item>
          </b-list-group>
        </b-col>

        <b-col cols="8">
          <!-- TODO: add releases selector, only display latest by default -->
          <b-card
            v-if="selectedRelease"
            hide-footer
            class="mb-3"
          >
            <template v-slot:header>
              <h6 class="mb-0">
                <b-badge>{{ selectedRelease.tag_name }}</b-badge>
                {{ selectedRelease.name }}
              </h6>
            </template>

            <small class="text-muted">
              {{ $t('releases.published', { date: formatDate(selectedRelease.published_at) }) }}
            </small>

            <b-card-text>
              <vue-markdown :source="selectedRelease.body" class="w-100 releases" />
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VueMarkdown from 'vue-markdown';
import moment from 'moment';

export default {
  components: {
    VueMarkdown,
  },

  data() {
    return {
      selectedRelease: null,
    };
  },

  computed: {
    ...mapState(['releases', 'notification', 'settings']),
  },

  mounted() {
    const [latestRelease] = this.releases;

    this.selectedRelease = latestRelease;

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
      return moment(date).format('LL');
    },
  },
};
</script>
