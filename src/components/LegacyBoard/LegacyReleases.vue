<template lang="html">
  <b-dropdown-item v-b-modal:releases>
    <b-icon-mailbox class="mr-1" />
    Releases

    <b-modal
      id="releases"
      title="Releases"
      modal-class="releases"
      scrollable
      hide-footer
      size="lg"
      @show="loadReleases"
    >
      <div v-if="releases">
        <b-card
          v-for="release in releases"
          :key="release.id"
          header-tag="header"
          hide-footer
          class="mb-3"
        >
          <template v-slot:header>
            <h6 class="mb-0">
              <b-badge>{{ release.tag_name }}</b-badge>
              {{ release.name }}
            </h6>
          </template>

          <small class="text-muted">
            {{ $t('releases.published', { date: formatDate(release.published_at) }) }}
          </small>

          <b-card-text>
            <vue-markdown :source="release.body" />
          </b-card-text>
        </b-card>
      </div>

      <b-card
        v-else
        v-for="n in 3"
        :key="n"
        header-tag="header"
        class="mb-3"
        hide-footer
      >
        <template v-slot:header>
          <placeholder />
        </template>

        <b-card-text>
          <placeholder :lines="3" />
        </b-card-text>
      </b-card>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import moment from 'moment';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    VueMarkdown,
    Placeholder,
  },

  data() {
    return {
      releases: null,
    };
  },

  methods: {
    formatDate(date) {
      return moment(date).format('LL');
    },

    async loadReleases() {
      this.releases = await this.$store.dispatch('LOAD_RELEASES');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  .releases img {
    max-width: 100%;
    margin-top: 1rem;
  }
</style>
