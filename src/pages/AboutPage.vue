<template lang="html">
  <section>
    <div class="container py-3">
      <div v-html="formattedReadme" />
      <!-- <vue-markdown
        class="w-100"
        v-if="readme"
        :source="readme"
      /> -->

      <div v-if="repo" class="mb-4">
        <a
          href="https://github.com/romancm/gamebrary/subscription"
          target="_blank"
          class="btn btn-sm btn-outline-primary me-2"
        >
          {{ $t('gitHub.watch') }} <span class="badge bg-light text-dark">{{ repo.watchers }}</span>
        </a>

        <a
          href="https://github.com/romancm/gamebrary"
          target="_blank"
          class="btn btn-sm btn-outline-primary me-2"
        >
          {{ $t('gitHub.star') }} <span class="badge bg-light text-dark">{{ repo.stargazers_count }}</span>
        </a>

        <a
          href="https://github.com/romancm/gamebrary/fork"
          target="_blank"
          class="btn btn-sm btn-outline-primary me-2"
        >
          {{ $t('gitHub.fork') }} <span class="badge bg-light text-dark">{{ repo.forks }}</span>
        </a>

        <a
          href="https://github.com/romancm/gamebrary/issues"
          target="_blank"
          class="btn btn-sm btn-outline-primary"
        >
          {{ $t('gitHub.issues') }} <span class="badge bg-light text-dark">{{ repo.open_issues }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import { marked } from 'marked';

export default {
  data() {
    return {
      readme: null,
      repo: null,
    };
  },

  computed: {
    formattedReadme() {
      return this.readme
        ? marked(this.readme)
        : null;
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
