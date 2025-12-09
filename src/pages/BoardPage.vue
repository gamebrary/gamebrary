<template lang="html">
  <BoardPlaceholder v-if="loading" />

  <div v-else-if="hasAccess">
    <EditListSidebar v-if="isBoardOwner && board.type !== BOARD_TYPE_STANDARD" />
    <CloneBoardSidebar v-if="user" />

    <portal to="headerActions">
      <div v-if="user" class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-dark' : 'btn-dark'"
          type="button"
          id="boardActionsDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ board.name }}
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="boardActionsDropdown">
          <li v-if="canEdit">
            <a class="dropdown-item" href="#" @click.prevent="$bus?.$emit('bv::toggle::collapse', 'edit-board-sidebar')">
              <i class="fa-solid fa-pen fa-fw" /> Edit board
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="$bus?.$emit('bv::toggle::collapse', 'clone-board-sidebar')">
              <i class="fa-regular fa-clone fa-fw" /> Clone board
            </a>
          </li>
          <li v-if="publicUserName">
            <router-link
              class="dropdown-item d-flex align-items-center"
              :to="{ name: 'public.profile', params: { userName: publicUserName }}"
            >
              <img
                v-if="avatarImage"
                :src="avatarImage"
                class="rounded-circle me-1"
                style="width: 24px; height: 24px; object-fit: cover;"
                alt=""
              />
              {{ publicUserName }}
            </router-link>
          </li>
        </ul>
      </div>

      <button
        v-else
        type="button"
        class="btn"
        :class="darkTheme ? 'btn-dark' : 'btn-dark'"
      >
        {{ board.name }}
      </button>
    </portal>

    <StandardBoard v-if="board.type === BOARD_TYPE_STANDARD" />
    <TierBoard v-else-if="board.type === BOARD_TYPE_TIER" />
    <GridBoard v-else-if="board.type === BOARD_TYPE_GRID" />
    <KanbanBoard v-else />
  </div>

  <div v-else class="alert alert-warning" role="alert">
    <span>Private Board</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import KanbanBoard from '@/components/Board/KanbanBoard';
import GridBoard from '@/components/Board/GridBoard';
import TierBoard from '@/components/Board/TierBoard';
import StandardBoard from '@/components/Board/StandardBoard';
import EditListSidebar from '@/components/Lists/EditListSidebar';
import CloneBoardSidebar from '@/components/CloneBoardSidebar';
import chunk from 'lodash.chunk';
import { getImageThumbnail } from '@/utils';
import {
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,
  BOARD_TYPE_GRID,
  MAX_QUERY_LIMIT
} from '@/constants';

const route = useRoute();
const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Reactive state
const loading = ref(true);
const avatarImage = ref(null);
const backgroundUrl = ref(null);
const publicProfile = ref({});

// Store state and getters
const user = computed(() => store.state.user);
const dragging = computed(() => store.state.dragging);
const board = computed(() => store.state.board);
const wallpapers = computed(() => store.state.wallpapers);
const profile = computed(() => store.state.profile);
const darkTheme = computed(() => store.getters.darkTheme);
const isBoardOwner = computed(() => store.getters.isBoardOwner);

// Computed properties
const isBoardPage = computed(() => route.name === 'board');

const hasAccess = computed(() => user.value || board.value?.isPublic);

const publicUserName = computed(() => publicProfile.value?.userName);

const boardId = computed(() => route.params?.id);

const isBoardCached = computed(() => board.value.id === boardId.value);

const canEdit = computed(() => Boolean(route.name === 'board' && isBoardOwner.value));

// Watchers
watch(backgroundUrl, (wallpaperUrl) => {
  if (wallpaperUrl) $bus.$emit('UPDATE_WALLPAPER', wallpaperUrl);
});

watch(boardId, (newBoardId) => {
  if (newBoardId) {
    backgroundUrl.value = null;
    loadBoard();
  }
});

// Methods
const moveListLeft = (listIndex) => {
  if (!isBoardOwner.value) return;
  store.commit('MOVE_LIST_LEFT', listIndex);
  saveBoard();
};

const moveListRight = (listIndex) => {
  if (!isBoardOwner.value) return;
  store.commit('MOVE_LIST_RIGHT', listIndex);
  saveBoard();
};

const loadBoard = async () => {
  loading.value = !isBoardCached.value;

  await store.dispatch('LOAD_BOARD', boardId.value)
    .catch(() => {
      return router.replace({ name: 'home' });
    });

  document.title = `${board.value.name} - Gamebrary`;

  if (hasAccess.value) {
    if (board.value?.isPublic && !isBoardOwner.value) loadPublicProfile();
    loadBoardGames();
    loadBoardBackground();
  }
};

const loadBoardBackground = async () => {
  const bgUrl = board.value?.backgroundUrl;

  if (board.value?.backgroundColor) $bus.$emit('UPDATE_BACKGROUND_COLOR', board.value?.backgroundColor);
  if (!bgUrl) {
    backgroundUrl.value = null;
    return;
  }
  if (bgUrl.includes('igdb')) {
    backgroundUrl.value = bgUrl;
    return;
  }

  try {
    backgroundUrl.value = await store.dispatch('LOAD_FIREBASE_IMAGE', bgUrl);
  } catch (e) {
    if (e?.code === 'storage/object-not-found') removeBoardWallpaper();
  }
};

const removeBoardWallpaper = async () => {
  const updatedBoard = { ...board.value, backgroundUrl: null };
  store.commit('SET_ACTIVE_BOARD', updatedBoard);
  await store.dispatch('SAVE_BOARD');
};

const loadPublicProfile = async () => {
  publicProfile.value = await store.dispatch('LOAD_PUBLIC_PROFILE_BY_USER_ID', board.value?.owner)
    .catch(() => ({}));

  if (!publicProfile.value?.avatar) return;

  const avatar = getImageThumbnail(publicProfile.value?.avatar);

  avatarImage.value = avatar
    ? await store.dispatch('LOAD_FIREBASE_IMAGE', avatar)
    : null;
};

const saveBoard = async () => {
  await store.dispatch('SAVE_BOARD')
    .catch(() => {
      store.commit('SET_SESSION_EXPIRED', true);
    });
};

const loadBoardGames = () => {
  const { lists } = board.value;

  const boardGames = lists?.length
    ? Array.from(new Set(lists.map(({ games }) => games).flat()))
    : [];

  if (boardGames.length === 0) {
    loading.value = false;
    return boardGames;
  }

  return boardGames.length > MAX_QUERY_LIMIT
    ? loadGamesInChunks(boardGames)
    : loadGames(boardGames);
};

const loadGames = async (gameList) => {
  try {
    await store.dispatch('LOAD_IGDB_GAMES', gameList);
  } catch (e) {
    showToast('Error loading games', 'danger');
  }

  loading.value = false;
};

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

const loadGamesInChunks = (gameList) => {
  const chunkedGameList = chunk(gameList, MAX_QUERY_LIMIT);
  chunkedGameList.forEach((chunkedList) => {
    loadGames(chunkedList);
  });
};

// Lifecycle hooks
onMounted(async () => {
  if (!isBoardCached.value) store.commit('CLEAR_BOARD');

  loadBoard();
  $bus.$on('MOVE_LIST_LEFT', moveListLeft);
  $bus.$on('MOVE_LIST_RIGHT', moveListRight);
  $bus.$on('LOAD_BOARD_WALLPAPER', loadBoardBackground);
});

onBeforeUnmount(() => {
  $bus.$off('MOVE_LIST_LEFT', moveListLeft);
  $bus.$off('MOVE_LIST_RIGHT', moveListRight);
  $bus.$off('LOAD_BOARD_WALLPAPER', loadBoardBackground);
  $bus.$emit('CLEAR_WALLPAPER');
  $bus.$emit('UPDATE_BACKGROUND_COLOR', null);
});
</script>
