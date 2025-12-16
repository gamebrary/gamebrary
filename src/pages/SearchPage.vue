<template lang="html">
  <section class="d-flex flex-column">
    <portal to="headerActions">
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn me-1 border-0"
          :class="filterSelected ? 'btn-outline-danger' : darkTheme ? 'btn-outline-light' : 'btn-outline-danger'"
          data-bs-toggle="offcanvas" data-bs-target="#filtersSidebar" :title="'Filters'">
          <i class="fa-regular fa-filter" />
        </button>

        <nav v-if="searchResults.length > 0" aria-label="Search results pagination">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: loading || currentPage === 1 }">
              <button class="page-link" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''"
                @click="goToPreviousPage" :disabled="loading || currentPage === 1"
                :tabindex="(loading || currentPage === 1) ? -1 : 0" aria-label="Previous">
                Previous
              </button>
            </li>
            <li class="page-item active">
              <span class="page-link" :class="darkTheme ? 'bg-primary border-primary' : ''">
                {{ currentPage }}
              </span>
            </li>
            <li class="page-item" :class="{ disabled: loading || !hasMore }">
              <button class="page-link" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''"
                @click="goToNextPage" :disabled="loading || !hasMore" :tabindex="(loading || !hasMore) ? -1 : 0"
                aria-label="Next">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </portal>

    <SearchFilters />

    <div class="d-md-none px-3 mb-3">
      <SearchBox :loading="loading" />
    </div>

    <GameCard v-for="game in searchResults" class="mb-3 mx-3" :game-id="game.id" :key="game.id" />

    <p v-if="!loading && query.length > 0 && !searchResults.length"
      :class="['text-center mt-5', { 'text-info': darkTheme }]">
      No results found
    </p>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardsStore } from '@/stores/boards';
import { useGamesStore } from '@/stores/games';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import GameCard from '@/components/GameCard';
import SearchFilters from '@/components/SearchFilters';
import SearchBox from '@/components/SearchBox';
import { IGDB_QUERIES } from '@/constants';

const route = useRoute();
const boardsStore = useBoardsStore();
const gamesStore = useGamesStore();
const twitchStore = useTwitchStore();
const { darkTheme } = useAppGetters();

// Reactive state
const searchResults = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const offset = ref(0);
const hasMore = ref(false);

// Store state and getters
const boards = computed(() => boardsStore.boards);

// Computed properties
const filterBy = computed(() => {
  return route.query?.filterBy
    ? [route.query.filterBy]
    : [];
});

const filterValue = computed(() => {
  return route.query?.value
    ? [route.query.value]
    : [];
});

const query = computed(() => {
  return route.query.q
    ? route.query.q.trim()
    : '';
});

const boardId = computed(() => route.query?.boardId);

const boardListIndex = computed(() => route.query?.listIndex);

const showEmptyState = computed(() => route?.query?.q === undefined);

const currentPage = computed(() => {
  return Math.floor(offset.value / pageSize.value) + 1;
});

const filterSelected = computed(() => {
  return Boolean(route.query?.filterBy && route.query?.value);
});

// Methods
const clearResults = () => {
  searchResults.value = [];
  offset.value = 0;
  hasMore.value = false;
};

const goToNextPage = () => {
  if (!hasMore.value || loading.value) return;
  offset.value = offset.value + pageSize.value;
  search();
};

const goToPreviousPage = () => {
  if (currentPage.value === 1 || loading.value) return;
  offset.value = Math.max(0, offset.value - pageSize.value);
  search();
};

const search = async () => {
  loading.value = true;

  const searchQuery = query.value
    ? `search "${query.value}";`
    : '';

  const filter = filterBy.value.length && filterValue.value.length
    ? `where ${filterBy.value[0]} = (${filterValue.value[0]});`
    : '';

  try {
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }
    const results = await gamesStore.queryIGDB({
      path: 'games',
      data: `${searchQuery} ${IGDB_QUERIES.SEARCH} limit ${pageSize.value + 1}; offset ${offset.value}; ${filter};`,
    });

    // Check if there are more results
    if (results.length > pageSize.value) {
      hasMore.value = true;
      searchResults.value = results.slice(0, pageSize.value);
    } else {
      hasMore.value = false;
      searchResults.value = results;
    }
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(query, () => {
  offset.value = 0;
  search();
});

watch(pageSize, () => {
  search();
});

watch(filterValue, () => {
  offset.value = 0;
  search();
});

// Lifecycle hooks
onMounted(() => {
  if (filterBy.value.length || filterValue.value.length || !showEmptyState.value) {
    search();
  }
});
</script>
