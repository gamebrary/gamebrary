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
import { useStore } from 'vuex';
import { marked } from 'marked';

const store = useStore();

// Reactive state
const readme = ref(null);
const repo = ref(null);

// Computed properties
const formattedReadme = computed(() => {
  return readme.value ? marked(readme.value) : null;
});

// Methods
const load = async () => {
  readme.value = await store.dispatch('LOAD_GITHUB_README');
  repo.value = await store.dispatch('LOAD_GITHUB_REPOSITORY');
};

// Lifecycle hooks
onMounted(() => {
  load();
});
</script>
