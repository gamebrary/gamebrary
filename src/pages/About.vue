<template lang="html">
  <b-container class="pt-2">
    <h2>{{ $t('about.title') }}</h2>
    <p>{{ $t('about.subtitle') }}</p>

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

    <vue-markdown
      class="w-100"
      v-if="readme"
      :source="readme"
    />
  </b-container>
</template>

<script>
import VueMarkdown from 'vue-markdown';
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
    async load() {
      this.readme = await this.$store.dispatch('LOAD_GITHUB_README');
      this.repo = await this.$store.dispatch('LOAD_GITHUB_REPOSITORY');
    },
  },
};
</script>
