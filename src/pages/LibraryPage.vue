<template lang="html">
  <div class="px-3">
    <portal v-if="likedGames.length" to="headerActions">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-success' : 'btn-dark'"
          type="button"
          id="gamesDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Games
        </button>
        <ul class="dropdown-menu" aria-labelledby="gamesDropdown">
          <li>
            <button
              type="button"
              class="dropdown-item"
              title="Add games"
              @click="addGame"
            >
              <i class="fa-solid fa-plus" />
              Add games
            </button>
          </li>
        </ul>
      </div>

      <div class="dropdown ms-2">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-success' : 'btn-dark'"
          type="button"
          id="sortDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Sort
        </button>
        <ul class="dropdown-menu" aria-labelledby="sortDropdown">
          <li
            v-for="option in sortOptions"
            :key="option.value"
          >
            <button
              type="button"
              class="dropdown-item"
              :class="{ 'active': sortBy === option.value }"
              @click="changeSort(option.value)"
            >
              <i :class="option.icon" class="me-2" />
              {{ option.label }}
              <i
                v-if="sortBy === option.value"
                :class="sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'"
                class="ms-2"
              />
            </button>
          </li>
        </ul>
      </div>
    </portal>

    <EmptyState
      v-if="!user"
      illustration="games"
    >
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
    </EmptyState>

    <div v-else-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="likedGames.length" class="small-container pb-5">
      <GameCard
        v-for="game in sortedGames"
        :key="game.id"
        :game-id="game.id"
        :ref="(el) => { if (el) gameRefs[`id-${game.id}`] = [el] }"
        class="mb-3"
      />
    </div>

    <EmptyState
      v-else
      title="Welcome to your collection of top picks!"
      message="Here you'll find all the games you’ve marked as your favorites."
    >
      <button
        type="button"
        class="btn"
        :class="darkTheme ? 'btn-success' : 'btn-primary'"
        data-bs-toggle="tooltip"
        title="Add games"
        @click="addGame"
      >
        Add games
      </button>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { useStore } from 'vuex';
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';

const store = useStore();
const $bus = inject('$bus');

// Reactive state
const loading = ref(true);
const view = ref('grid');
const sortBy = ref('name');
const sortOrder = ref('asc');
const gameRefs = ref({});

// Store state and getters
const games = computed(() => store.state.games);
const cachedGames = computed(() => store.state.cachedGames);
const user = computed(() => store.state.user);
const progresses = computed(() => store.state.progresses);
const highlightedGame = computed(() => store.state.highlightedGame);
const gamesSortOrder = computed(() => store.state.gamesSortOrder);
const darkTheme = computed(() => store.getters.darkTheme);
const navPosition = computed(() => store.getters.navPosition);
const buttonProps = computed(() => store.getters.buttonProps);

// Computed properties
const likedGames = computed(() => {
  if (!user.value) return null;
  return Object.entries(games.value)?.filter(([liked]) => liked)?.map(([id]) => cachedGames.value?.[id]);
});

const sortedGames = computed(() => {
  if (!likedGames.value) return [];

  // Use Firebase sort order if available, otherwise fall back to client-side sorting
  if (gamesSortOrder.value?.gameIds?.length > 0 && gamesSortOrder.value.sortBy === sortBy.value) {
    const sorted = gamesSortOrder.value.gameIds
      .map(id => cachedGames.value?.[id])
      .filter(game => game);
    return sortOrder.value === 'desc' ? sorted.reverse() : sorted;
  }

  // Fallback to client-side sorting
  return sortGamesList(likedGames.value);
});

const likedGamesIds = computed(() => {
  return Object.entries(games.value)?.filter(([liked]) => liked)?.map(([id]) => Number(id));
});

const sortOptions = computed(() => [
  { value: 'name', label: 'Name', icon: 'fa-solid fa-font' },
  { value: 'progress', label: 'Progress', icon: 'fa-solid fa-percent' },
  { value: 'tags', label: 'Tags', icon: 'fa-solid fa-tags' },
  { value: 'dateAdded', label: 'Date Added', icon: 'fa-solid fa-calendar' },
]);

// Watchers
watch(games, () => {
  if (highlightedGame.value) highlightGame(highlightedGame.value);
});

// Methods
const addGame = () => {
  store.commit('SET_GAME_SELECTOR_DATA', {
    title: 'Add games to your favorites',
    filter: likedGamesIds.value,
  });
};

const selectGame = (gameId) => {
  $bus.$emit('LIKE_UNLIKE_GAME', gameId);
};

const highlightGame = async (gameId) => {
  await nextTick();
  const gameRef = gameRefs.value[`id-${gameId}`]?.[0];

  console.log('gameRef', gameRef);

  if (gameRef) {
    gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      store.commit('SET_HIGHLIGHTED_GAME', null);
    }, HIGHLIGHTED_GAME_TIMEOUT);
  }
};

const loadGames = async () => {
  try {
    loading.value = true;

    // Load games with Firebase-level sorting
    await store.dispatch('LOAD_GAMES_SORTED', {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });

    const cachedGamesKeys = Object.keys(cachedGames.value);
    const gamesNotCached = Object.keys(games.value)?.filter((game) => !cachedGamesKeys.includes(String(game)))?.toString();

    if (gamesNotCached) {
      await store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);

      // Save game metadata for newly cached games
      for (const gameId of gamesNotCached.split(',')) {
        if (games.value[gameId]) {
          await store.dispatch('SAVE_USER_GAME', {
            gameId: gameId.trim(),
            gameData: cachedGames.value[gameId],
          });
        }
      }
    }
  } catch (e) {
    // Fallback to regular loading if sorted loading fails
    await store.dispatch('LOAD_GAMES');
  } finally {
    loading.value = false;
  }
};

const changeSort = async (newSortBy) => {
  if (sortBy.value === newSortBy) {
    // Toggle sort order if same field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = newSortBy;
    sortOrder.value = 'asc';
  }

  // Reload with new sort
  await loadGames();
};

const sortGamesList = (gamesList) => {
  const sorted = [...gamesList];

  switch (sortBy.value) {
    case 'name':
      sorted.sort((a, b) => {
        const nameA = (a?.name || '').toLowerCase();
        const nameB = (b?.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;
    case 'progress':
      sorted.sort((a, b) => {
        const progressA = progresses.value?.[a?.id] || 0;
        const progressB = progresses.value?.[b?.id] || 0;
        return progressA - progressB;
      });
      break;
    case 'tags':
      sorted.sort((a, b) => {
        const tagsA = getGameTagCount(a?.id);
        const tagsB = getGameTagCount(b?.id);
        return tagsA - tagsB;
      });
      break;
    case 'dateAdded':
      // Use Firebase sort order if available
      if (gamesSortOrder.value?.gameIds?.length > 0) {
        const orderMap = {};
        gamesSortOrder.value.gameIds.forEach((id, index) => {
          orderMap[id] = index;
        });
        sorted.sort((a, b) => {
          const orderA = orderMap[a?.id] ?? 9999;
          const orderB = orderMap[b?.id] ?? 9999;
          return orderA - orderB;
        });
      }
      break;
  }

  return sortOrder.value === 'desc' ? sorted.reverse() : sorted;
};

const getGameTagCount = (gameId) => {
  const tags = store.state.tags?.tags || store.state.tags || [];
  return tags.filter(tag => tag?.games?.includes(Number(gameId))).length;
};

// Lifecycle hooks
onBeforeMount(() => {
  if (user.value) {
    loadGames();
  } else {
    loading.value = false;
  }

  $bus.$on('SELECT_GAME', selectGame);
});

onMounted(() => {
  // Initialize tooltips
  nextTick(() => {
    const el = document.querySelector('[data-bs-toggle="tooltip"]');
    if (el) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    }
  });
});

onBeforeUnmount(() => {
  $bus.$off('SELECT_GAME', selectGame);
});
</script>
