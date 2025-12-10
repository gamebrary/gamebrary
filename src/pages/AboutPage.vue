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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';
import axios from 'axios';

// Reactive state
const readme = ref(null);
const repo = ref(null);

// Computed properties
const formattedReadme = computed(() => {
  return readme.value ? marked(readme.value) : null;
});

// Methods
const loadGitHubReadme = async () => {
  const { data } = await axios.get('https://raw.githubusercontent.com/romancm/gamebrary/main/README.md');
  return data;
};

const loadGitHubRepository = async () => {
  const { data } = await axios.get('https://api.github.com/repos/romancm/gamebrary');
  return data;
};

const load = async () => {
  readme.value = await loadGitHubReadme();
  repo.value = await loadGitHubRepository();
};

// Lifecycle hooks
onMounted(() => {
  load();
});
</script>
