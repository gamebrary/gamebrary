<template lang="html">
  <form @submit.prevent="search">
    <div class="input-group">
      <input v-model="searchText" type="search" class="form-control" placeholder="Search games"
        @input="debounceSearch" />

      <button type="submit" class="btn btn-outline-secondary">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

        <PhMagnifyingGlass v-else :size="16" weight="fill" aria-hidden />
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PhMagnifyingGlass } from '@phosphor-icons/vue';

const props = defineProps({
  loading: Boolean,
});

const route = useRoute();
const router = useRouter();

// Reactive state
const searchText = ref('');
const debounceTimer = ref(null);

// Methods
const debounceSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(() => {
    search();
  }, 500);
};

const search = () => {
  if (route.query?.q === searchText.value || searchText.value === '') return;

  router.push({
    name: 'search',
    query: { ...route.query, q: searchText.value },
  });
};

// Lifecycle hooks
onMounted(() => {
  searchText.value = route.query.q || '';
});

onBeforeUnmount(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>
