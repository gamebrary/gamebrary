<template lang="html">
  <AppSidebar
    id="game-selector-sidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @hidden="closeSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" :title="title" />
    </template>

    <div
      class="px-3"
      :class="darkTheme ? 'bg-dark' : 'bg-light'"
      style="position: sticky; top: 0px; z-index: 1"
    >
      <input
        v-model="searchText"
        class="form-control mb-2"
        placeholder="Search games (e.g. Axiom Verge)"
        type="search"
        @input="debounceSearch"
      />

      <div v-if="filteredSearchResults.length" class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="preventClose"
          id="preventCloseSwitch"
        />
        <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="preventCloseSwitch">
          Select multiple
        </label>
      </div>
    </div>

    <div v-if="loading" style="height: 80px" class="mt-5 d-flex justify-content-center align-items-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

      <div v-else-if="filteredSearchResults.length > 0" class="mx-3">
        <GameCard
          v-for="game in filteredSearchResults"
          :game-id="game.id"
          :key="game.id"
          selectable
          class="mb-1"
          @click="selectGame(game.id)"
        />
      </div>

      <div v-else-if="searchText">
        No results
      </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, inject } from 'vue';
import { useStore } from 'vuex';
import GameCard from '@/components/GameCard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import { IGDB_QUERIES } from '@/constants';

const store = useStore();
const $bus = inject('$bus');

// Reactive state
const searchText = ref('');
const loading = ref(false);
const preventClose = ref(false);
const searchResults = ref([]);
const localFilter = ref([]);
const debounceTimer = ref(null);

// Store state and getters
const board = computed(() => store.state.board);
const gameSelectorData = computed(() => store.state.gameSelectorData);
const isBoardOwner = computed(() => store.getters.isBoardOwner);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const title = computed(() => {
  return gameSelectorData.value?.title || 'Select a game';
});

const filter = computed(() => {
  const filterData = gameSelectorData.value?.filter || [];
  return [...filterData, ...localFilter.value];
});

const visible = computed(() => Boolean(gameSelectorData.value));

const filteredSearchResults = computed(() => {
  return searchResults.value.filter(({ id }) => !filter.value?.includes(id));
});

// Methods
const handleVisibilityChange = (newVisible) => {
  if (!newVisible) {
    closeSidebar();
  }
};

const hideSidebar = () => {
  store.commit('CLEAR_GAME_SELECTOR_DATA');
};

const debounceSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(() => {
    search();
  }, 500);
};

const selectGame = (gameId) => {
  if (preventClose.value) {
    localFilter.value.push(gameId);
  }

  const eventName = gameSelectorData.value?.eventName || 'SELECT_GAME';

  if ($bus) {
    $bus.$emit(eventName, gameId);
  }

  store.commit('SET_HIGHLIGHTED_GAME', gameId);

  if (!preventClose.value) {
    store.commit('CLEAR_GAME_SELECTOR_DATA');
  }
};

const search = async () => {
  loading.value = true;

  const searchQuery = searchText.value
    ? `search "${searchText.value}";`
    : '';

  const filterQuery = !searchText.value
    ? 'where rating >= 80;'
    : '';

  try {
    searchResults.value = await store.dispatch('IGDB', {
      path: 'games',
      data: `${searchQuery} ${IGDB_QUERIES.SEARCH} limit 50; ${filterQuery}`,
      mutation: 'CACHE_GAME_DATA',
    });
  } finally {
    loading.value = false;
  }
};

const closeSidebar = () => {
  searchText.value = '';
  loading.value = false;
  preventClose.value = false;
  searchResults.value = [];
  localFilter.value = [];

  store.commit('CLEAR_GAME_SELECTOR_DATA');
};

// Lifecycle hooks
onBeforeUnmount(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-thumbnail {
  width: 80px;
  height: auto;
}
</style>
