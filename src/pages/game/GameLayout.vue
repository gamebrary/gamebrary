<template lang="html">
  <div v-if="!loading && !game" class="pt-5">
    <div class="d-flex justify-content-center align-items-center">
      <h1 class="mr-3 pr-3 align-top border-right border-danger inline-block align-content-center text-danger">404</h1>
      <div class="inline-block align-middle">
        <h2 class="font-weight-normal lead text-danger">Game was not found.</h2>
      </div>
    </div>
  </div>

  <section v-else :class="[{ 'text-light': darkTheme }]" class="px-3">
    <portal to="headerActions">
      <div v-if="game && user" class="dropdown">
        <button class="btn dropdown-toggle" :class="buttonProps?.variant ? `btn-${buttonProps.variant}` : 'btn-primary'"
          type="button" id="gameActionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <span :title="gameName" class="d-sm-none">{{ shortTruncatedGameName }}</span>
          <span :title="gameName" class="d-none d-sm-inline d-md-none">{{ truncatedGameName }}</span>
          <span class="d-none d-md-inline">{{ gameName }}</span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="gameActionsDropdown">
          <li>
            <button type="button" class="dropdown-item"
              @click="$router.push({ name: 'game.notes', params: { id: gameId, slug: gameSlug } })">
              Add note
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#gameTagsSidebar">
              Edit tags
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item" data-bs-toggle="offcanvas"
              data-bs-target="#addRemoveGameSidebar">
              Add to list
            </button>
          </li>
        </ul>
      </div>
    </portal>

    <GameMediaModal />

    <div class="game-page-layout">
      <aside class="game-cover-section">
        <img :src="getImageUrl(cachedGame)" :alt="gameName" class="game-cover-img" @click="openMediaModal" />
      </aside>

      <main class="game-content-section">
        <div class="game-header-info mb-3">
          <div class="d-flex align-items-center mb-2">
            <h1 class="mb-0 me-2" :class="{ 'text-danger': isLiked }">
              {{ gameName }}
            </h1>
            <span v-if="gameCategory" class="badge bg-info">
              {{ gameCategory }}
            </span>
          </div>

          <div class="mb-3">
            <template v-for="(developer, index) in gameDevelopers" :key="index">
              <router-link v-if="developer && developer.id"
                :to="{ name: 'company', params: { id: developer.id, slug: developer.slug } }" class="link-primary me-2">
                {{ developer.name }}
              </router-link>
            </template>
            <template v-for="publisher in gamePublishers" :key="publisher.id">
              <router-link v-if="publisher && publisher.id"
                :to="{ name: 'company', params: { id: publisher.id, slug: publisher.slug } }" class="link-primary me-2">
                {{ publisher.name }}
              </router-link>
            </template>
          </div>

          <div v-if="user" class="mb-3">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-sm"
                :class="progressStatus === 'not-started' ? 'btn-primary' : (darkTheme ? 'btn-outline-light' : 'btn-outline-secondary')"
                @click="setProgressStatus('not-started')">
                Not Started
              </button>
              <button type="button" class="btn btn-sm"
                :class="progressStatus === 'in-progress' ? 'btn-primary' : (darkTheme ? 'btn-outline-light' : 'btn-outline-secondary')"
                @click="setProgressStatus('in-progress')">
                In Progress
              </button>
              <button type="button" class="btn btn-sm"
                :class="progressStatus === 'completed' ? 'btn-primary' : (darkTheme ? 'btn-outline-light' : 'btn-outline-secondary')"
                @click="setProgressStatus('completed')">
                Completed
              </button>
            </div>
          </div>
        </div>

        <div class="game-tabs-wrapper mb-3">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.overview', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.overview' || $route.name === 'game' }" role="tab">
                Overview
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.screenshots', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.screenshots' }" role="tab">
                Screenshots
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.similar', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.similar' }" role="tab">
                Similar
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.speedruns', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.speedruns' }" role="tab">
                Speedruns
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.notes.tab', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.notes.tab' }" role="tab">
                Notes
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.boards', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.boards' }" role="tab">
                Boards
              </router-link>
            </li>
            <li class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.stats', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.stats' }" role="tab">
                Stats
              </router-link>
            </li>
            <li v-if="hasRequirements" class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.requirements', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.requirements' }" role="tab">
                Requirements
              </router-link>
            </li>
            <li v-if="highlightedAchievements" class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.achievements', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.achievements' }" role="tab">
                Achievements
              </router-link>
            </li>
            <li v-if="latestNews && latestNews.length" class="nav-item" role="presentation">
              <router-link :to="{ name: 'game.news', params: { id: gameId, slug: gameSlug } }" class="nav-link"
                :class="{ active: $route.name === 'game.news' }" role="tab">
                News
              </router-link>
            </li>
          </ul>

        </div>

        <div class="tab-content">
          <router-view />
        </div>
      </main>
    </div>

    <GameTagsSidebar />
    <AddRemoveGame />
    <p v-if="legalNotice" class="text-muted mt-2 mb-5 p-3 small" v-html="legalNotice" />
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { setPageTitle, getImageUrl } from '@/utils';
import { useGamesStore } from '@/stores/games';
import { useTagsStore } from '@/stores/tags';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useNotesStore } from '@/stores/notes';
import { useProgressesStore } from '@/stores/progresses';
import { useTwitchStore } from '@/stores/twitch';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters, useGameGetters } from '@/stores/getters';
import { WEBSITE_CATEGORIES, GAME_CATEGORIES, PLATFORMS } from '@/constants';
import GameTagsSidebar from '@/components/Game/GameTagsSidebar';
import AddRemoveGame from '@/components/AddRemoveGame';
import GameMediaModal from '@/components/Game/GameMediaModal';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, IGDB_QUERIES } from '@/constants';

const route = useRoute();
const gamesStore = useGamesStore();
const tagsStore = useTagsStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const notesStore = useNotesStore();
const progressesStore = useProgressesStore();
const twitchStore = useTwitchStore();
const wallpapersStore = useWallpapersStore();
const { darkTheme, buttonProps } = useAppGetters();
const $bus = inject('$bus');

const loading = ref(false);
const wikipediaDescription = ref(null);

// Store state
const game = computed(() => gamesStore.game);
const cachedGames = computed(() => gamesStore.cachedGames);
const tags = computed(() => tagsStore.tags);
const boards = computed(() => boardsStore.boards);
const user = computed(() => userStore.user);
const notes = computed(() => notesStore.notes);
const progresses = computed(() => progressesStore.progresses);
const twitchToken = computed(() => twitchStore.twitchToken);
const games = computed(() => gamesStore.games);
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Game getters
const gameGetters = computed(() => game.value ? useGameGetters(game.value) : null);
const gameNews = computed(() => gameGetters.value?.gameNews || []);
const gameLinks = computed(() => gameGetters.value?.gameLinks || []);
const gameGenres = computed(() => gameGetters.value?.gameGenres || []);

// Computed properties
const gameId = computed(() => route.params?.id);
const gameSlug = computed(() => route.params?.slug || game.value?.slug);
const cachedGame = computed(() => cachedGames.value?.[Number(gameId.value)] || game.value);
const gameName = computed(() => cachedGame.value?.name);
const truncatedGameName = computed(() => gameName.value?.length > 30 ? `${gameName.value.substring(0, 30)}...` : gameName.value);
const shortTruncatedGameName = computed(() => gameName.value?.length > 16 ? `${gameName.value.substring(0, 16)}...` : gameName.value);

const gameDevelopers = computed(() => {
  return game.value?.involved_companies
    ?.filter(({ developer }) => developer)
    ?.map(({ company }) => company) || [];
});

const gamePublishers = computed(() => {
  return game.value?.involved_companies
    ?.filter(({ publisher }) => publisher)
    ?.map(({ company }) => company) || [];
});

const gameProgress = computed(() => {
  return gameId.value && progresses.value?.[gameId.value] ? progresses.value[gameId.value] : 0;
});

const progressStatus = computed(() => {
  const progress = gameProgress.value;
  if (progress === 0 || !progress) return 'not-started';
  if (progress === 100) return 'completed';
  return 'in-progress';
});

const releaseYear = computed(() => {
  if (!game.value?.release_dates?.[0]?.date) return null;
  return new Date(game.value.release_dates[0].date * 1000).getFullYear();
});

const gamePlatforms = computed(() => {
  return game.value?.platforms?.map(({ id }) => {
    return {
      id,
      name: PLATFORMS?.[id]?.name,
    };
  }) || [];
});

const gamePlatformsText = computed(() => {
  return gamePlatforms.value.map(p => p.name).join(', ');
});

const gameGenresText = computed(() => {
  return gameGenres.value.map(g => g.name).join(', ');
});

const playerPerspectives = computed(() => game.value?.player_perspectives || []);
const playerPerspectivesText = computed(() => {
  return playerPerspectives.value.map(p => p.name).join(', ');
});

const legalNotice = computed(() => game.value?.steam?.legal_notice);
const isLiked = computed(() => games.value?.[gameId.value]);
const gameCategory = computed(() => GAME_CATEGORIES?.[game.value?.category]);
const highlightedAchievements = computed(() => game.value?.steam?.achievements?.highlighted);

const macRequirements = computed(() => {
  return game.value?.steam?.mac_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.mac_requirements, platform: 'mac' }
    : null;
});

const linuxRequirements = computed(() => {
  return game.value?.steam?.linux_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.linux_requirements, platform: 'linux' }
    : null;
});

const pcRequirements = computed(() => {
  return game.value?.steam?.pc_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.pc_requirements, platform: 'windows' }
    : null;
});

const hasRequirements = computed(() => {
  return [
    macRequirements.value,
    linuxRequirements.value,
    pcRequirements.value,
  ].some((req) => req);
});

const latestNews = computed(() => {
  if (!Array.isArray(gameNews.value)) return [];
  return gameNews.value.slice(0, 10);
});

// Methods
const openMediaModal = () => {
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
};

const setProgressStatus = async (status) => {
  if (!user.value || !game.value) return;

  let progress = 0;
  if (status === 'in-progress') {
    progress = gameProgress.value > 0 && gameProgress.value < 100 ? gameProgress.value : 50;
  } else if (status === 'completed') {
    progress = 100;
  } else {
    progress = 0;
  }

  try {
    progressesStore.setGameProgress({
      progress,
      gameId: game.value.id,
    });
    await progressesStore.saveProgresses(user.value.uid);
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

const waitAndLoadGame = () => {
  loading.value = true;
  setTimeout(() => {
    if (!twitchToken.value) {
      waitAndLoadGame();
    } else {
      loadGame();
    }
  }, 500);
};

const loadGame = async () => {
  try {
    loading.value = true;
    if ($bus) $bus.$emit('CLEAR_WALLPAPER');
    gamesStore.clearGame();

    try {
      if (!twitchToken.value) {
        await twitchStore.getTwitchToken();
      }
      const results = await gamesStore.queryIGDB({
        path: 'games',
        data: `${IGDB_QUERIES.GAME} where id = ${gameId.value};`,
      });
      if (results && results.length > 0) {
        gamesStore.setGame(results[0]);
      }
    } catch (e) {
      console.error('Error loading game from IGDB:', e);
    }

    setPageTitle(game.value?.name);

    try {
      const wikipediaSlug = game.value?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)?.url?.split('/wiki/')?.[1];
      wikipediaDescription.value = wikipediaSlug
        ? await gamesStore.loadWikipediaDescription(wikipediaSlug)
        : null;
    } catch (e) {
      console.error('Error loading Wikipedia description:', e);
      wikipediaDescription.value = null;
    }

    const steamUrl = game.value?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID)?.url;
    const steamGameId = steamUrl?.split('app/')?.[1]?.split('/')?.[0];

    if (steamGameId) {
      try {
        await gamesStore.loadSteamGame(steamGameId);
      } catch (e) {
        console.error('Error loading Steam game:', e);
      }

      try {
        await gamesStore.loadSteamGameNews(steamGameId);
      } catch (e) {
        console.error('Error loading Steam game news:', e);
      }
    }

    const gogPage = game.value?.websites?.find(({ category }) => category === GOG_CATEGORY_ID);
    if (gogPage) {
      try {
        await gamesStore.loadGogGame(game.value?.name);
      } catch (e) {
        console.error('Error loading GOG game:', e);
      }
    }
  } catch (e) {
    console.error('Error in loadGame:', e);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(gameId, (newGameId) => {
  if (newGameId) loadGame();
});

// Lifecycle hooks
onMounted(async () => {
  nextTick(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  });

  if (!twitchToken.value) {
    waitAndLoadGame();
    return;
  }

  if (user.value && (!tags.value || tags.value.length === 0)) {
    await tagsStore.loadTags(user.value.uid);
  }

  loadGame();
});

onBeforeUnmount(() => {
  if ($bus) $bus.$emit('CLEAR_WALLPAPER');
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-page-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.game-cover-section {
  position: sticky;
  top: 1rem;

  @media (max-width: 768px) {
    position: static;
    justify-self: center;
  }
}

.game-cover-img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid var(--bs-border-color);
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    max-width: 200px;
  }
}

.game-content-section {
  min-width: 0; // Prevents grid overflow
}

.game-header-info {
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
}

.game-tabs-wrapper {
  border-bottom: 1px solid var(--bs-border-color);
}

.nav-tabs {
  border-bottom: none;

  .nav-link {
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.75rem 1rem;
    color: var(--bs-secondary);
    transition: all 0.2s;

    &:hover {
      border-bottom-color: var(--bs-primary);
      color: var(--bs-primary);
    }

    &.router-link-active,
    &.active {
      color: var(--bs-primary);
      background-color: transparent;
      border-bottom-color: var(--bs-primary);
      font-weight: 500;
    }
  }
}

.tab-content {
  margin-top: 1.5rem;
}
</style>
