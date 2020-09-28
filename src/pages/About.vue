<template lang="html">
  <b-container fluid>
    <b-jumbotron
      header="About Gamebrary"
      header-level="5"
      fluid
      lead="Links to github here"
    />

    <b-container>
      <vue-markdown
        class="w-100"
        v-if="readme"
        :source="readme"
      />

      <small>©{{ currentYear }} Gamebrary</small>
    </b-container>
  </b-container>
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
      readme: null,
      repo: null,
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    formatDate(date) {
      return moment(date).format('LL');
    },

    async load() {
      this.readme = await this.$store.dispatch('LOAD_GITHUB_README');
      this.repo = await this.$store.dispatch('LOAD_GITHUB_REPOSITORY');
    },
  },
};
</script>
