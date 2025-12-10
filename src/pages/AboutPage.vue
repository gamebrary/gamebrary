<template lang="html">
  <section>
    <div class="container py-3">
      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>

      <div v-else>
        <div v-if="formattedReadme" v-html="formattedReadme" />
        <!-- <vue-markdown
          class="w-100"
          v-if="readme"
          :source="readme"
        /> -->

        <div v-if="repo" class="mb-4">
          <a href="https://github.com/romancm/gamebrary/subscription" target="_blank"
            class="btn btn-sm btn-outline-primary me-2">
            {{ t('gitHub.watch') }} <span class="badge bg-light text-dark">{{ repo.watchers }}</span>
          </a>

          <a href="https://github.com/romancm/gamebrary" target="_blank" class="btn btn-sm btn-outline-primary me-2">
            {{ t('gitHub.star') }} <span class="badge bg-light text-dark">{{ repo.stargazers_count }}</span>
          </a>

          <a href="https://github.com/romancm/gamebrary/fork" target="_blank"
            class="btn btn-sm btn-outline-primary me-2">
            {{ t('gitHub.fork') }} <span class="badge bg-light text-dark">{{ repo.forks }}</span>
          </a>

          <a href="https://github.com/romancm/gamebrary/issues" target="_blank" class="btn btn-sm btn-outline-primary">
            {{ t('gitHub.issues') }} <span class="badge bg-light text-dark">{{ repo.open_issues }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import axios from 'axios';

const { t } = useI18n();

// Reactive state
const readme = ref(null);
const repo = ref(null);
const loading = ref(true);
const error = ref(null);

// Computed properties
const formattedReadme = computed(() => {
  return readme.value ? marked(readme.value) : null;
});

// Methods
const loadGitHubReadme = async (defaultBranch = 'main') => {
  try {
    const { data } = await axios.get(`https://raw.githubusercontent.com/romancm/gamebrary/${defaultBranch}/README.md`);
    return data;
  } catch (e) {
    // Try master branch if main fails
    if (defaultBranch === 'main') {
      return loadGitHubReadme('master');
    }
    throw e;
  }
};

const loadGitHubRepository = async () => {
  try {
    const { data } = await axios.get('https://api.github.com/repos/romancm/gamebrary');
    return data;
  } catch (e) {
    console.error('Failed to load GitHub repository:', e);
    return null;
  }
};

const load = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Load repo first to get default branch
    repo.value = await loadGitHubRepository();
    const defaultBranch = repo.value?.default_branch || 'main';

    // Load README using the default branch
    readme.value = await loadGitHubReadme(defaultBranch);
  } catch (e) {
    console.error('Failed to load GitHub data:', e);
    error.value = 'Failed to load content from GitHub. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  load();
});
</script>
