<template lang="html">
  <div>
    <b-jumbotron
      :header="$t('releases.title')"
      header-level="5"
      fluid
      class="position-sticky"
    />

    <b-container fluid>
      <b-form-row>
        <b-col cols="3">
          <b-list-group>
            <b-list-group-item
              button
              class="d-flex justify-content-between align-items-center"
              v-for="release in releases"
              :key="release.id"
              :active="selectedRelease && release.id === selectedRelease.id"
              @click="selectedRelease = release"
            >
              <h6 class="m-0">
                <b-badge>{{ release.tag_name }}</b-badge>
                <span class="d-none d-md-inline">{{ release.name }}</span>
              </h6>
            </b-list-group-item>
          </b-list-group>
        </b-col>

        <b-col cols="9">
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
              {{ $t('releases.published') }} {{ formatDate(selectedRelease.published_at) }}
            </small>

            <b-card-text>
              <vue-markdown :source="selectedRelease.body" class="w-100 releases" />
            </b-card-text>
          </b-card>
        </b-col>
      </b-form-row>
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
