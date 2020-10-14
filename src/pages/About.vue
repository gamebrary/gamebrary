<template lang="html">
  <div>
    <b-jumbotron
      :header="$t('about.title')"
      :lead="$t('about.subtitle')"
      :bg-variant="nightMode ? 'dark' : ''"
      :text-variant="nightMode ? 'white' : ''"
      :border-variant="nightMode ? 'dark' : ''"
      header-level="5"
      fluid
    >
    <div v-if="repo">
      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/subscription"
        target="_blank"
      >
        {{ $t('gitHub.watch') }} <b-badge variant="light">{{ repo.watchers }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary"
        target="_blank"
      >
        {{ $t('gitHub.star') }} <b-badge variant="light">{{ repo.stargazers_count }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/fork"
        target="_blank"
      >
        {{ $t('gitHub.fork') }} <b-badge variant="light">{{ repo.forks }}</b-badge>
      </b-button>

      <b-button
        size="sm"
        href="https://github.com/romancm/gamebrary/issues"
        target="_blank"
      >
        {{ $t('gitHub.issues') }} <b-badge variant="light">{{ repo.open_issues }}</b-badge>
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
import { mapGetters } from 'vuex';

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
    ...mapGetters(['nightMode']),

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
