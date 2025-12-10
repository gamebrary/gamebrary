<template lang="html">
  <section class="d-flex flex-column">
    <portal to="headerActions">
      <div class="d-flex">
        <button
          type="button"
          class="btn me-1 border-0"
          :class="filterSelected ? 'btn-outline-danger' : darkTheme ? 'btn-outline-light' : 'btn-outline-danger'"
          data-bs-toggle="offcanvas"
          data-bs-target="#filtersSidebar"
          :title="'Filters'"
        >
          <i class="fa-regular fa-filter" />
        </button>

        <SearchBox :loading="loading" />
      </div>
    </portal>

    <SearchFilters />

    <GameCard
      v-for="game in searchResults"
      class="mb-3 mx-3"
      :game-id="game.id"
      :key="game.id"
    />

    <button
      v-if="searchResults.length === pageSize"
      type="button"
      class="btn w-100 mb-2"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      @click="loadMore"
      :disabled="loading"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
      <span v-else>More results</span>
    </button>

    <p
      v-if="!loading && query.length > 0 && !searchResults.length"
      :class="['text-center mt-5', { 'text-info' : darkTheme }]"
    >
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
const pageSize = ref(20);
const offset = ref(0);

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

const showPreviousButton = computed(() => offset.value >= pageSize.value);

const filterSelected = computed(() => {
  return Boolean(route.query?.filterBy && route.query?.value);
});

// Methods
const clearResults = () => {
  searchResults.value = [];
  offset.value = 0;
};

const loadMore = () => {
  offset.value = offset.value + pageSize.value;
  search();
};

const prev = () => {
  offset.value = offset.value - pageSize.value;
  search();
};

const search = async () => {
  loading.value = true;

  if (searchResults.value.length > 0 && offset.value === 0) {
    clearResults();
  }

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
      data: `${searchQuery} ${IGDB_QUERIES.SEARCH} limit ${pageSize.value}; offset ${offset.value}; ${filter};`,
    });

    searchResults.value = [
      ...searchResults.value,
      ...results,
    ];
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
