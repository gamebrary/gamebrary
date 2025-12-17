<template lang="html">
  <div class="library-dashboard">
    <portal to="headerActions">
      <div class="d-flex align-items-center gap-2">
        <div class="flex-grow-1" style="max-width: 400px;">
          <form @submit.prevent="handleSearch">
            <div class="input-group">
              <input v-model="searchText" type="search" class="form-control" placeholder="Search games"
                @input="debounceSearch" />
              <button type="submit" class="btn btn-outline-secondary">
                <span v-if="searchLoading" class="spinner-border spinner-border-sm" role="status"></span>
                <PhMagnifyingGlass v-else :size="16" weight="fill" aria-hidden />
              </button>
            </div>
          </form>
        </div>

        <button type="button" class="btn"
          :class="hasActiveFilters ? 'btn-primary' : darkTheme ? 'btn-outline-light' : 'btn-outline-dark'"
          data-bs-toggle="offcanvas" data-bs-target="#libraryFiltersSidebar" :title="'Filters'">
          <PhFunnel :size="16" weight="regular" />
          <span v-if="activeFilterCount > 0" class="badge bg-light text-dark ms-1">{{ activeFilterCount }}</span>
        </button>

        <div class="dropdown">
          <button class="btn dropdown-toggle" :class="darkTheme ? 'btn-outline-light' : 'btn-outline-dark'"
            type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <PhSortAscending :size="16" weight="fill" class="me-1" />
            Sort
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown">
            <li v-for="option in sortOptions" :key="option.value">
              <button type="button" class="dropdown-item" :class="{ 'active': sortBy === option.value }"
                @click="changeSort(option.value)">
                <component :is="iconComponents[option.icon]" :size="16" weight="fill" class="me-2" />
                {{ option.label }}
                <component v-if="sortBy === option.value" :is="sortOrder === 'asc' ? PhCaretUp : PhCaretDown" :size="16"
                  weight="fill" class="ms-2" />
              </button>
            </li>
          </ul>
        </div>

        <div class="btn-group" role="group">
          <button type="button" class="btn"
            :class="view === 'grid' ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-outline-light' : 'btn-outline-dark')"
            @click="view = 'grid'" title="Grid View">
            <PhGridFour :size="16" weight="fill" />
          </button>
          <button type="button" class="btn"
            :class="view === 'list' ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-outline-light' : 'btn-outline-dark')"
            @click="view = 'list'" title="List View">
            <PhList :size="16" weight="fill" />
          </button>
        </div>
      </div>
    </portal>

    <div v-if="hasActiveFilters && likedGames.length" class="px-3 pt-3">
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <span class="text-muted small">Filters:</span>
        <span v-if="filters.platform" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Platform: {{ getPlatformName(filters.platform) }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('platform')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.genre" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Genre: {{ getGenreName(filters.genre) }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('genre')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.status" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Status: {{ getStatusName(filters.status) }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('status')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.played !== null" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Played: {{ filters.played ? 'Yes' : 'No' }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('played')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.ratingMin !== null" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Rating: {{ filters.ratingMin }}+
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('ratingMin')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.releaseYear !== null" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Year: {{ filters.releaseYear }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('releaseYear')"
            aria-label="Remove filter" />
        </span>
        <span v-if="filters.tag !== null" class="badge" :class="darkTheme ? 'bg-primary' : 'bg-primary'">
          Tag: {{ getTagName(filters.tag) }}
          <button type="button" class="btn-close btn-close-white ms-1" @click="clearFilter('tag')"
            aria-label="Remove filter" />
        </span>
        <button v-if="hasActiveFilters" type="button" class="btn btn-sm btn-link text-decoration-none"
          @click="clearAllFilters">
          Clear all
        </button>
      </div>
    </div>

    <LibraryFilters v-model:filters="filters" />

    <EmptyState v-if="!user" illustration="games">
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
    </EmptyState>

    <div v-else-if="loading" class="spinner-centered d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="filteredAndSortedGames.length" class="px-3 pb-5">
      <div v-if="view === 'grid'" class="game-grid">
        <GameCard v-for="game in filteredAndSortedGames" :key="game.id" :game-id="game.id"
          :ref="(el) => { if (el) gameRefs[`id-${game.id}`] = [el] }" vertical />
      </div>

      <div v-else class="game-list">
        <GameCard v-for="game in filteredAndSortedGames" :key="game.id" :game-id="game.id"
          :ref="(el) => { if (el) gameRefs[`id-${game.id}`] = [el] }" class="mb-3" />
      </div>

      <PaginationControls v-if="!searchText && (currentPage > 1 || hasMoreGames)" :current-page="currentPage"
        :total-pages="totalPages" :has-more="hasMoreGames" :loading="loading || loadingMore" @page-change="goToPage"
        class="mt-4 mb-3" />
    </div>

    <EmptyState v-else-if="!loading && (!likedGames || likedGames.length === 0)"
      title="Welcome to your collection of top picks!"
      message="Here you'll find all the games you've marked as your favorites.">
      <button type="button" class="btn" :class="darkTheme ? 'btn-success' : 'btn-primary'" data-bs-toggle="tooltip"
        title="Add games" @click="addGame">
        Add games
      </button>
    </EmptyState>

    <EmptyState v-else-if="!loading && likedGames.length > 0 && filteredAndSortedGames.length === 0"
      title="No games match your filters" message="Try adjusting your filters or search query.">
      <button type="button" class="btn" :class="darkTheme ? 'btn-success' : 'btn-primary'" @click="clearAllFilters">
        Clear filters
      </button>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import { useProgressesStore } from '@/stores/progresses';
import { useTagsStore } from '@/stores/tags';
import { useUIStore } from '@/stores/ui';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';
import LibraryFilters from '@/components/LibraryFilters';
import PaginationControls from '@/components/PaginationControls';
import { HIGHLIGHTED_GAME_TIMEOUT, GAME_GENRES, PLATFORMS } from '@/constants';
import {
  PhMagnifyingGlass,
  PhFunnel,
  PhSortAscending,
  PhGridFour,
  PhList,
  PhTextT,
  PhPercent,
  PhTag,
  PhCalendar,
  PhStar,
  PhCalendarBlank,
  PhCaretUp,
  PhCaretDown,
} from '@phosphor-icons/vue';

const gamesStore = useGamesStore();
const userStore = useUserStore();
const progressesStore = useProgressesStore();
const tagsStore = useTagsStore();
const uiStore = useUIStore();
const twitchStore = useTwitchStore();
const { darkTheme } = useAppGetters();
const $bus = inject('$bus');

const iconComponents = {
  PhTextT,
  PhPercent,
  PhTag,
  PhCalendar,
  PhStar,
  PhCalendarBlank,
};

// Reactive state
const loading = ref(true);
const loadingMore = ref(false);
const searchLoading = ref(false);
const view = ref('grid');
const sortBy = ref('name');
const sortOrder = ref('asc');
const gameRefs = ref({});
const searchText = ref('');
const debounceTimer = ref(null);

// Filters
const filters = ref({
  platform: null,
  genre: null,
  status: null,
  played: null,
  ratingMin: null,
  releaseYear: null,
  tag: null,
});

// Store state and getters
const games = computed(() => gamesStore.games);
const cachedGames = computed(() => gamesStore.cachedGames);
const user = computed(() => userStore.user);
const progresses = computed(() => progressesStore.progresses);
const highlightedGame = computed(() => uiStore.highlightedGame);
const gamesSortOrder = computed(() => gamesStore.gamesSortOrder);
const tags = computed(() => tagsStore.tags || []);

// Computed properties
const likedGames = computed(() => {
  if (!user.value) return null;
  if (!games.value || Object.keys(games.value).length === 0) return [];

  return Object.entries(games.value)
    ?.filter(([id, liked]) => liked)
    ?.map(([id]) => {
      // Try both string and number keys
      const gameId = String(id);
      const gameIdNum = Number(id);
      const cached = cachedGames.value?.[gameId] || cachedGames.value?.[gameIdNum];

      // Return cached game if available, otherwise return minimal game object with ID
      return cached || { id: Number(id) };
    })
    ?.filter(game => game && game.id);
});

const filteredGames = computed(() => {
  if (!likedGames.value) return [];

  let filtered = [...likedGames.value];

  // Search filter
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase().trim();
    filtered = filtered.filter(game => {
      return game?.name?.toLowerCase().includes(searchLower);
    });
  }

  // Platform filter
  if (filters.value.platform !== null) {
    filtered = filtered.filter(game => {
      return game?.platforms?.includes(filters.value.platform);
    });
  }

  // Genre filter
  if (filters.value.genre !== null) {
    filtered = filtered.filter(game => {
      return game?.genres?.includes(filters.value.genre);
    });
  }

  // Status filter
  if (filters.value.status !== null) {
    filtered = filtered.filter(game => {
      const gameId = Number(game?.id);
      const progress = progresses.value?.[gameId] || 0;

      switch (filters.value.status) {
        case 'playing':
          return progress > 0 && progress < 100;
        case 'completed':
          return progress === 100;
        case 'backlog':
          return progress === 0;
        case 'wishlist':
          // Wishlist games have no progress and are liked
          return progress === 0;
        default:
          return true;
      }
    });
  }

  // Played filter
  if (filters.value.played !== null) {
    filtered = filtered.filter(game => {
      const gameId = Number(game?.id);
      const progress = progresses.value?.[gameId] || 0;
      return filters.value.played ? progress > 0 : progress === 0;
    });
  }

  // Rating filter
  if (filters.value.ratingMin !== null) {
    filtered = filtered.filter(game => {
      const rating = Math.round((game?.rating || 0) / 10); // IGDB rating is 0-100, convert to 0-10
      return rating >= filters.value.ratingMin;
    });
  }

  // Release year filter
  if (filters.value.releaseYear !== null) {
    filtered = filtered.filter(game => {
      if (!game?.release_dates?.[0]?.date) return false;
      const releaseYear = new Date(game.release_dates[0].date * 1000).getFullYear();
      return releaseYear === filters.value.releaseYear;
    });
  }

  // Tag filter
  if (filters.value.tag !== null) {
    filtered = filtered.filter(game => {
      const gameId = Number(game?.id);
      const tag = tags.value.find(t => t.id === filters.value.tag);
      return tag?.games?.includes(gameId);
    });
  }

  return filtered;
});

const sortedGames = computed(() => {
  if (!filteredGames.value.length) return [];

  // Use Firebase sort order if available, otherwise fall back to client-side sorting
  if (gamesSortOrder.value?.gameIds?.length > 0 && gamesSortOrder.value.sortBy === sortBy.value) {
    // Map games according to sort order, handling ID type mismatches
    const sorted = gamesSortOrder.value.gameIds
      .map(id => {
        const idNum = Number(id);
        return filteredGames.value.find(game => Number(game?.id) === idNum);
      })
      .filter(game => game);

    // If sorted array is empty or doesn't contain all filtered games, fall back to client-side sorting
    // This can happen if sort order is stale, incomplete, or has ID type mismatches
    if (sorted.length === 0 || sorted.length !== filteredGames.value.length) {
      return sortGamesList(filteredGames.value);
    }

    return sortOrder.value === 'desc' ? sorted.reverse() : sorted;
  }

  // Fallback to client-side sorting
  return sortGamesList(filteredGames.value);
});

const filteredAndSortedGames = computed(() => sortedGames.value);

const likedGamesIds = computed(() => {
  return Object.entries(games.value)?.filter(([id, liked]) => liked)?.map(([id]) => Number(id));
});

const sortOptions = computed(() => [
  { value: 'name', label: 'Name', icon: 'PhTextT' },
  { value: 'progress', label: 'Progress', icon: 'PhPercent' },
  { value: 'tags', label: 'Tags', icon: 'PhTag' },
  { value: 'dateAdded', label: 'Date Added', icon: 'PhCalendar' },
  { value: 'rating', label: 'Rating', icon: 'PhStar' },
  { value: 'releaseDate', label: 'Release Date', icon: 'PhCalendarBlank' },
]);

const PAGE_SIZE = 20; // Page size for pagination

const hasMoreGames = computed(() => gamesStore.gamesHasMore);
const currentPage = computed(() => gamesStore.currentPage || 1);
const totalGamesLoaded = computed(() => gamesStore.totalGamesLoaded || 0);
const totalPages = computed(() => {
  if (!hasMoreGames.value && totalGamesLoaded.value > 0) {
    return Math.ceil(totalGamesLoaded.value / PAGE_SIZE);
  }
  // If there are more games, estimate pages based on loaded games
  return Math.max(currentPage.value, Math.ceil(totalGamesLoaded.value / PAGE_SIZE));
});

const hasActiveFilters = computed(() => {
  return Object.entries(filters.value).some(([key, value]) => {
    // For numeric filters (ratingMin, releaseYear), 0 means no filter
    if (key === 'ratingMin' || key === 'releaseYear') {
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }
    // For boolean filters (played), false is a valid active filter
    if (key === 'played') {
      return value !== null && value !== undefined;
    }
    // For other filters, null/undefined means no filter
    return value !== null && value !== undefined && value !== '';
  });
});

const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter(value => value !== null).length;
});

// Watchers
watch(games, () => {
  if (highlightedGame.value) highlightGame(highlightedGame.value);
});

// Watch cachedGames to ensure games are displayed when data is loaded
watch(cachedGames, () => {
  // Force reactivity update when cachedGames changes
}, { deep: true });

// Methods
const addGame = () => {
  uiStore.setGameSelectorData({
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

  if (gameRef) {
    gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      uiStore.setHighlightedGame(null);
    }, HIGHLIGHTED_GAME_TIMEOUT);
  }
};

const loadGames = async (reset = true) => {
  try {
    if (reset) {
      loading.value = true;
    } else {
      loadingMore.value = true;
    }

    // Ensure Twitch token is available
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }

    // Always ensure we have games loaded from main collection first
    await gamesStore.loadGames(userStore.user.uid);

    // Then try loading games with Firebase-level sorting for better performance
    try {
      const result = await gamesStore.loadGamesSorted(userStore.user.uid, twitchStore.twitchToken, {
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        reset,
      });

      // Update current page if reset
      if (reset) {
        gamesStore.setCurrentPage(1);
      }
    } catch (e) {
      console.warn('loadGamesSorted failed, using games from main collection:', e);
      // Continue with games from main collection
    }

    // Ensure cachedGames is populated for all liked games
    const cachedGamesKeys = Object.keys(cachedGames.value || {});
    const likedGameIds = Object.keys(games.value || {}).filter(id => games.value[id]);

    if (likedGameIds.length > 0) {
      const gamesNotCached = likedGameIds.filter((gameId) => {
        const gameIdStr = String(gameId);
        const gameIdNum = Number(gameId);
        return !cachedGamesKeys.includes(gameIdStr) && !cachedGamesKeys.includes(String(gameIdNum));
      });

      if (gamesNotCached.length > 0) {
        const gamesNotCachedStr = gamesNotCached.join(',');
        await gamesStore.loadIGDBGames(twitchStore.twitchToken, gamesNotCachedStr);

        // Wait for cachedGames to be updated
        await nextTick();

        // Save game metadata for newly cached games
        for (const gameId of gamesNotCached) {
          const gameIdStr = String(gameId).trim();
          const gameIdNum = Number(gameId);
          const gameData = cachedGames.value?.[gameIdStr] || cachedGames.value?.[gameIdNum];

          if (games.value[gameId] && gameData) {
            await gamesStore.saveUserGame(userStore.user.uid, {
              gameId: gameIdStr,
              gameData: gameData,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Error loading games:', e);
    // Final fallback to regular loading
    if (reset) {
      await gamesStore.loadGames(userStore.user.uid);
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const goToPage = async (page) => {
  if (page === currentPage.value || loading.value) return;

  loading.value = true;

  try {
    if (page < currentPage.value) {
      // Going to a previous page - reload from start and navigate forward
      // This is a limitation of Firestore cursor pagination
      gamesStore.setCurrentPage(1);
      gamesStore.pageCursors = {};
      await loadGames(true);

      // Navigate forward to target page
      for (let p = 2; p <= page && hasMoreGames.value; p++) {
        await loadGames(false);
        gamesStore.setCurrentPage(p);
      }
    } else {
      // Going forward - load next pages until we reach target
      while (currentPage.value < page && hasMoreGames.value) {
        await loadGames(false);
        gamesStore.setCurrentPage(gamesStore.currentPage + 1);
      }
    }

    gamesStore.setCurrentPage(page);
  } catch (e) {
    console.error('Error navigating to page:', e);
  } finally {
    loading.value = false;
  }
};

const loadGamesForPage = async (page, cursor) => {
  loading.value = true;
  try {
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }

    await gamesStore.loadGamesSorted(userStore.user.uid, twitchStore.twitchToken, {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      reset: false,
      lastDoc: cursor,
    });

    gamesStore.setCurrentPage(page);
  } catch (e) {
    console.error('Error loading page:', e);
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

  // Reload with new sort (reset pagination) only if not using client-side filtering
  if (!hasActiveFilters.value && !searchText.value) {
    await loadGames(true);
  }
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
    case 'rating':
      sorted.sort((a, b) => {
        const ratingA = a?.rating || 0;
        const ratingB = b?.rating || 0;
        return ratingA - ratingB;
      });
      break;
    case 'releaseDate':
      sorted.sort((a, b) => {
        const dateA = a?.release_dates?.[0]?.date || 0;
        const dateB = b?.release_dates?.[0]?.date || 0;
        return dateA - dateB;
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
  return tags.value.filter(tag => tag?.games?.includes(Number(gameId))).length;
};

const handleSearch = () => {
  // Search is handled by debounceSearch
};

const debounceSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  searchLoading.value = true;
  debounceTimer.value = setTimeout(() => {
    searchLoading.value = false;
  }, 500);
};

const clearFilter = (filterType) => {
  filters.value[filterType] = null;
};

const clearAllFilters = () => {
  filters.value = {
    platform: null,
    genre: null,
    status: null,
    played: null,
    ratingMin: null,
    releaseYear: null,
    tag: null,
  };
  searchText.value = '';
};

const getPlatformName = (id) => {
  return PLATFORMS[id]?.name || id;
};

const getGenreName = (id) => {
  return GAME_GENRES.find(g => g.id === id)?.name || id;
};

const getStatusName = (status) => {
  const statusMap = {
    playing: 'Playing',
    completed: 'Completed',
    backlog: 'Backlog',
    wishlist: 'Wishlist',
  };
  return statusMap[status] || status;
};

const getTagName = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId);
  return tag?.name || tagId;
};

// Lifecycle hooks
onBeforeMount(async () => {
  if (user.value) {
    // Always load games from main collection first to ensure we have data
    await gamesStore.loadGames(userStore.user.uid);
    // Then try sorted loading
    await loadGames();
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
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>

<style lang="scss" scoped>
.library-dashboard {
  min-height: 100%;
}

.game-grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

  @media (max-width: $bp-xl) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: $bp-lg) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  @media (max-width: $bp-md) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  @media (max-width: $bp-sm) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.game-list {
  display: flex;
  flex-direction: column;
}
</style>
