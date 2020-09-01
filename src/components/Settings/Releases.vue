<template lang="html">
  <div class="releases">
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
        <vue-markdown :source="release.body" class="w-100" />
      </b-card-text>
    </b-card>
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

  computed: {
    ...mapState(['releases']),
  },

  methods: {
    formatDate(date) {
      return moment(date).format('LL');
    },
  },
};
</script>
