<!-- TODO: replace vuex with pinia -->
<!-- TODO: use vite instead of vue-cli -->
<template>
  <body
    id="app"
    :class="bodyClasses"
    :style="style"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <div v-if="loading" class="spinner-centered mt-5 d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <portal-target name="root"/>
      <GlobalNav v-if="user" />
      <PageHeader v-if="showPageDock" />
      <router-view class="viewport" />
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
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
import GameSelectorSidebar from '@/components/GameSelectorSidebar';
import EditBoardSidebar from '@/components/EditBoardSidebar';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import PageHeader from '@/components/PageHeader';
import GlobalNav from '@/components/GlobalNav';
import WallpaperDetailsSidebar from '@/components/WallpaperDetailsSidebar';
import EditTagSidebar from '@/components/EditTagSidebar';
import CreateBoardSidebar from '@/components/CreateBoardSidebar';
import CreateTagSidebar from '@/components/CreateTagSidebar';
import { KEYBOARD_SHORTCUTS, IGDB_QUERIES } from '@/constants';

const route = useRoute();
const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Reactive state
const loading = ref(false);
const hasScroll = ref(false);
const debugUserId = ref(null);
const backgroundImageUrl = ref(null);
const backgroundColor = ref(null);

// Store state and getters
const user = computed(() => store.state.user);
const settings = computed(() => store.state.settings);
const sessionExpired = computed(() => store.state.sessionExpired);
const platforms = computed(() => store.state.platforms);
const games = computed(() => store.state.games);
const gameSelectorData = computed(() => store.state.gameSelectorData);
const cachedGames = computed(() => store.state.cachedGames);
const darkTheme = computed(() => store.getters.darkTheme);
const navPosition = computed(() => store.getters.navPosition);

// Computed properties
const bodyClasses = computed(() => [
  route.name,
  `nav-${navPosition.value}`,
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

// Watchers
watch(sessionExpired, (expired) => {
  if (!expired) return;
  store.commit('CLEAR_SESSION');
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
    const mutation = isLiked ? 'UNLIKE_GAME' : 'LIKE_GAME';

    store.commit(mutation, gameId);

    await store.dispatch('SAVE_GAMES');

    // Maintain subcollection for Firebase-level sorting
    if (isLiked) {
      await store.dispatch('DELETE_USER_GAME', gameId);
    } else {
      const gameData = cachedGames.value?.[gameId];
      await store.dispatch('SAVE_USER_GAME', { gameId, gameData });
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
    await store.dispatch('IGDB', {
      path: 'platforms',
      data: IGDB_QUERIES.PLATFORMS,
      mutation: 'SET_PLATFORMS',
    });
  } catch (e) {
    showToast('There was an error loading platforms', 'danger');
  }
};

const boot = async () => {
  await Promise.allSettled([
    store.dispatch('LOAD_BOARDS'),
    store.dispatch('LOAD_PROFILE'),
    store.dispatch('LOAD_WALLPAPERS'),
    store.dispatch('LOAD_SETTINGS'),
    store.dispatch('LOAD_TAGS'),
    store.dispatch('LOAD_NOTES'),
    store.dispatch('LOAD_PROGRESSES'),
    store.dispatch('LOAD_GAMES'),
  ]);

  loading.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  $bus.$on('LIKE_UNLIKE_GAME', likeOrUnlikeGame);
  $bus.$on('CLEAR_WALLPAPER', clearWallpaperUrl);
  $bus.$on('UPDATE_WALLPAPER', updateWallpaperUrl);
  $bus.$on('BOOT', boot);
  $bus.$on('UPDATE_BACKGROUND_COLOR', updateBackgroundColor);

  loading.value = true;

  await store.dispatch('GET_TWITCH_TOKEN');

  init();
});
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
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

      .viewport {
        height: calc(100svh - 80px);
      }
    }

    .viewport {
      width: 100%;
      margin-left: 0;
      padding-bottom: 0;

      @media (min-width: 768px) {
        margin-left: 240px; // Space for left sidebar
        padding-bottom: 0;
      }

      @media (max-width: 767px) {
        padding-bottom: 60px; // Space for bottom nav
      }
    }

    &.board {
      .viewport {
        height: calc(100svh - 65px);
      }
    }
  }
</style>
