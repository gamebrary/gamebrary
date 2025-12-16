<template>

  <body id="app" :class="bodyClasses" :style="style" v-shortkey="KEYBOARD_SHORTCUTS" @shortkey="handleShortcutAction">
    <div v-if="loading" class="spinner-centered mt-5 d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <portal-target name="root" />
      <GlobalNav v-if="user" />
      <PageHeader v-if="showPageDock" />
      <router-view class="viewport" :class="!isBoardPage && (darkTheme ? 'bg-secondary' : 'bg-light')" />
      <KeyboardShortcutsModal />
      <markdown-cheatsheet />

      <template v-if="user">
        <EditTagSidebar />
        <CreateBoardSidebar />
        <CreateTagSidebar />
        <GameSelectorSidebar />
        <EditBoardSidebar />
        <WallpaperDetailsSidebar />
      </template>
    </template>
  </body>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useSettingsStore } from '@/stores/settings';
import { useGamesStore } from '@/stores/games';
import { useBoardsStore } from '@/stores/boards';
import { useTagsStore } from '@/stores/tags';
import { useNotesStore } from '@/stores/notes';
import { useProgressesStore } from '@/stores/progresses';
import { useProfileStore } from '@/stores/profile';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useUIStore } from '@/stores/ui';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet.vue';
import GameSelectorSidebar from '@/components/GameSelectorSidebar.vue';
import EditBoardSidebar from '@/components/EditBoardSidebar.vue';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal.vue';
import PageHeader from '@/components/PageHeader.vue';
import GlobalNav from '@/components/GlobalNav.vue';
import WallpaperDetailsSidebar from '@/components/WallpaperDetailsSidebar.vue';
import EditTagSidebar from '@/components/EditTagSidebar.vue';
import CreateBoardSidebar from '@/components/CreateBoardSidebar.vue';
import CreateTagSidebar from '@/components/CreateTagSidebar.vue';
import { KEYBOARD_SHORTCUTS, IGDB_QUERIES } from '@/constants';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const $bus = inject('$bus');

// Pinia stores
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const gamesStore = useGamesStore();
const boardsStore = useBoardsStore();
const tagsStore = useTagsStore();
const notesStore = useNotesStore();
const progressesStore = useProgressesStore();
const profileStore = useProfileStore();
const wallpapersStore = useWallpapersStore();
const uiStore = useUIStore();
const twitchStore = useTwitchStore();
const { darkTheme, navPosition } = useAppGetters();

// Reactive state
const loading = ref(false);
const hasScroll = ref(false);
const debugUserId = ref(null);
const backgroundImageUrl = ref(null);
const backgroundColor = ref(null);

// Store state and getters
const user = computed(() => userStore.user);
const settings = computed(() => settingsStore.settings);
const sessionExpired = computed(() => userStore.sessionExpired);
const platforms = computed(() => gamesStore.platforms);
const games = computed(() => gamesStore.games);
const gameSelectorData = computed(() => uiStore.gameSelectorData);
const cachedGames = computed(() => gamesStore.cachedGames);

// Computed properties
const bodyClasses = computed(() => [
  route.name,
  'nav-top',
  {
    'has-scroll': hasScroll.value,
    'dark text-light': darkTheme.value,
    'bg-dark': !backgroundColor.value && darkTheme.value,
    'bg-light': !backgroundColor.value && !darkTheme.value,
  }
]);

const showPageDock = computed(() => {
  if (['auth', 'home'].includes(route.name) && !user.value) return false;
  return Boolean(user.value) || isPublicRoute.value;
});

const style = computed(() => {
  const backgroundImage = ['game', 'board', 'profile', 'public.profile'].includes(route?.name) && backgroundImageUrl.value
    ? `background-image: url('${backgroundImageUrl.value}');`
    : null;

  const bgColor = backgroundColor.value
    ? `background-color: ${backgroundColor.value};`
    : null;

  return [backgroundImage, bgColor].join('');
});

const isPublicRoute = computed(() => route.meta?.public);

const isGamePage = computed(() => route.name === 'game');

const isBoardPage = computed(() => route.name === 'board' || route.name === 'public.board');

// Watchers
watch(sessionExpired, (expired) => {
  if (!expired) return;
  userStore.clearSession();
  router.replace({ name: 'auth' });
});

// Methods
const showToast = (message, variant = 'info') => {
  const toastElement = document.createElement('div');
  toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
};

const likeOrUnlikeGame = async (gameId) => {
  try {
    const isLiked = games.value?.[gameId];

    if (isLiked) {
      gamesStore.unlikeGame(gameId);
    } else {
      gamesStore.likeGame(gameId);
    }

    await gamesStore.saveGames(userStore.user.uid);

    // Maintain subcollection for Firebase-level sorting
    if (isLiked) {
      await gamesStore.deleteUserGame(userStore.user.uid, gameId);
    } else {
      const gameData = cachedGames.value?.[gameId];
      await gamesStore.saveUserGame(userStore.user.uid, { gameId, gameData });
    }
  } catch (e) {
    //
  }
};

const clearWallpaperUrl = () => {
  backgroundImageUrl.value = null;
};

const updateWallpaperUrl = (value) => {
  backgroundImageUrl.value = value;
};

const updateBackgroundColor = (value) => {
  backgroundColor.value = value;
};

const handleShortcutAction = (data) => {
  $bus.$emit('HANDLE_SHORTCUT', data);
};

const init = () => {
  if (!platforms.value?.length) loadPlatforms();
  if (isPublicRoute.value && !user.value) {
    loading.value = false;
    return;
  }

  if (user.value) {
    boot();
  } else {
    if (route.name !== 'auth') router.push({ name: 'auth' });
  }
};

const loadPlatforms = async () => {
  try {
    const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
    const { data } = await axios.get(`${API_BASE}/igdb?token=${twitchStore.twitchToken.access_token}&path=platforms&data=${IGDB_QUERIES.PLATFORMS}`);
    gamesStore.setPlatforms(data);
  } catch (e) {
    showToast('There was an error loading platforms', 'danger');
  }
};

const boot = async () => {
  const userId = userStore.user.uid;
  await Promise.allSettled([
    boardsStore.loadBoards(userId),
    profileStore.loadProfile(userId),
    wallpapersStore.loadWallpapers(userId),
    settingsStore.loadSettings(userId),
    tagsStore.loadTags(userId),
    notesStore.loadNotes(userId),
    progressesStore.loadProgresses(userId),
    gamesStore.loadGames(userId),
  ]);

  loading.value = false;
};

// Global click handler to hide tooltips when clicking outside
const handleDocumentClick = (event) => {
  // Get all tooltip instances
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
    if (tooltipInstance) {
      // Check if tooltip is currently shown (check for tooltip element in DOM)
      const tooltipId = tooltipTriggerEl.getAttribute('aria-describedby');
      const tooltipElement = tooltipId ? document.getElementById(tooltipId) : null;

      if (tooltipElement) {
        // Tooltip is shown, check if click is outside
        if (!tooltipTriggerEl.contains(event.target) && !tooltipElement.contains(event.target)) {
          tooltipInstance.hide();
        }
      }
    }
  });
};

// Lifecycle hooks
onMounted(async () => {
  $bus.$on('LIKE_UNLIKE_GAME', likeOrUnlikeGame);
  $bus.$on('CLEAR_WALLPAPER', clearWallpaperUrl);
  $bus.$on('UPDATE_WALLPAPER', updateWallpaperUrl);
  $bus.$on('BOOT', boot);
  $bus.$on('UPDATE_BACKGROUND_COLOR', updateBackgroundColor);

  // Add global click handler to hide tooltips
  document.addEventListener('click', handleDocumentClick);

  loading.value = true;

  await twitchStore.getTwitchToken();

  init();
});

onBeforeUnmount(() => {
  // Remove global click handler
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style lang="scss" rel="stylesheet/scss">
@import "@/styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#app {
  display: flex;
  background-size: cover;
  background-attachment: fixed;
  background-position: top;
  height: calc(100dvh - 10px);
  overflow-y: auto;

  &.nav-top {
    padding-top: 65px;

    @media (max-width: calc($bp-md - 1px)) {
      padding-top: 0; // Remove top padding on mobile when header is at bottom
    }

    .viewport {
      height: calc(100svh - 80px);
    }
  }

  .viewport {
    width: 100%;
    margin-left: 0;
    padding-bottom: 0;

    @media (min-width: $bp-md) {
      margin-left: 240px; // Space for left sidebar
      padding-bottom: 0;
    }

    @media (max-width: calc($bp-md - 1px)) {
      padding-bottom: 116px; // Space for GlobalNav mobile (60px) + PageHeader (56px)
    }
  }

  &.board {
    .viewport {
      height: calc(100svh - 65px);
    }
  }
}
</style>
