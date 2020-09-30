<template lang="html">
  <div>
    <b-jumbotron
      header="About Gamebrary"
      header-level="5"
      fluid
      lead="Readme from GitHub"
    >
    <div v-if="repo">
      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/subscription"
        target="_blank"
      >
        Watch <b-badge variant="light">{{ repo.watchers }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary"
        target="_blank"
      >
        Star <b-badge variant="light">{{ repo.stargazers_count }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/fork"
        target="_blank"
      >
        Fork <b-badge variant="light">{{ repo.forks }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/issues"
        target="_blank"
      >
        Issues <b-badge variant="light">{{ repo.open_issues }}</b-badge>
      </b-button>
    </div>
    </b-jumbotron>

    <b-container>
      <vue-markdown
        class="w-100"
        v-if="readme"
        :source="readme"
      />
    </b-container>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import moment from 'moment';

export default {
  components: {
    VueMarkdown,
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
