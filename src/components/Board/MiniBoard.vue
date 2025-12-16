<template lang="html">
  <div class="card overflow-hidden rounded p-0" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
    <router-link v-if="board?.id && !noLink" :to="{ name: 'board', params: { id: board.id } }">
      <div :style="backgroundSyle" class="mini-board overflow-hidden" :class="{ thumbnail }">
        <h4 v-if="!thumbnail" class="px-2 py-2" :class="{ 'text-white': hasCustomBackground || darkTheme }">
          {{ board.name }}
        </h4>

        <span v-if="showPublicIndicator" class="badge position-absolute m-1"
          :class="darkTheme ? 'bg-warning' : 'bg-danger'" style="right: 0; top: 0; font-size: 0.75rem;">
          Public
        </span>

        <component :is="miniBoardComponent" :board="formattedBoard" />
      </div>
    </router-link>
    <div v-else>
      <div :style="backgroundSyle" class="mini-board overflow-hidden" :class="{ thumbnail }">
        <h4 v-if="!thumbnail" class="px-2 py-2" :class="{ 'text-white': hasCustomBackground || darkTheme }">
          {{ board?.name }}
        </h4>

        <span v-if="showPublicIndicator" class="badge position-absolute m-1"
          :class="darkTheme ? 'bg-warning' : 'bg-danger'" style="right: 0; top: 0; font-size: 0.75rem;">
          Public
        </span>

        <component v-if="formattedBoard" :is="miniBoardComponent" :board="formattedBoard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useAppGetters } from '@/stores/getters';
import { getStorage, ref as firebaseStorageRef, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER, BOARD_TYPE_GRID, BOARD_TYPE_KANBAN, IMAGE_SIZE_THUMB } from '@/constants';
import { getImageUrl } from '@/utils';
import StandardMiniBoard from '@/components/MiniBoards/StandardMiniBoard';
import GridMiniBoard from '@/components/MiniBoards/GridMiniBoard';
import KanbanMiniBoard from '@/components/MiniBoards/KanbanMiniBoard';
import TierMiniBoard from '@/components/MiniBoards/TierMiniBoard';

const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage(app);

const props = defineProps({
  board: Object,
  thumbnail: Boolean,
  noLink: Boolean,
});

const route = useRoute();
const gamesStore = useGamesStore();
const { darkTheme } = useAppGetters();

// Reactive state
const backgroundUrl = ref('');

// Store state and getters
const cachedGames = computed(() => gamesStore.cachedGames);
const game = computed(() => gamesStore.game);

// Component mapping
const miniBoardComponents = {
  [BOARD_TYPE_TIER]: TierMiniBoard,
  [BOARD_TYPE_STANDARD]: StandardMiniBoard,
  [BOARD_TYPE_GRID]: GridMiniBoard,
  [BOARD_TYPE_KANBAN]: KanbanMiniBoard,
};

// Computed properties
const miniBoardComponent = computed(() => {
  const boardType = props.board?.type || BOARD_TYPE_KANBAN;
  return miniBoardComponents[boardType] || KanbanMiniBoard;
});

const formattedBoard = computed(() => {
  if (!props.board) return null;

  const formattedLists = props.board?.lists?.map((list) => ({
    ...list,
    games: list?.games
      ?.map((game) => {
        if (!game) return null;

        const gameId = Number(game);
        const cachedGame = cachedGames.value?.[gameId] || cachedGames.value?.[String(gameId)] || {};

        // Only return game object if it has an id (meaning it was found in cache)
        if (!cachedGame.id) {
          return null;
        }

        return {
          id: cachedGame.id,
          name: cachedGame.name,
          src: getImageUrl(cachedGame, IMAGE_SIZE_THUMB, true),
        };
      })
      .filter(Boolean) || [], // Filter out null/undefined entries
  }));

  const formattedBoardData = {
    ...props.board,
    lists: formattedLists,
  };

  return formattedBoardData;
});

const hasCustomBackground = computed(() => {
  return props.board?.backgroundColor || props.board?.backgroundUrl;
});

const showPublicIndicator = computed(() => {
  return route.name !== 'home' && props.board?.isPublic;
});

const backgroundSyle = computed(() => {
  if (backgroundUrl.value) return `background-image: url(${backgroundUrl.value});`;
  if (props.board?.backgroundColor) return `background-color: ${props.board.backgroundColor};`;

  return null;
});

// Methods
const loadFirebaseImage = async (path) => {
  return await getDownloadURL(firebaseStorageRef(storage, path));
};

const loadWallpaper = async () => {
  if (props.board?.backgroundUrl) {
    backgroundUrl.value = props.board?.backgroundUrl?.includes('igdb')
      ? props.board?.backgroundUrl
      : await loadFirebaseImage(props.board?.backgroundUrl);
  }
};

// Watchers
watch(() => props.board?.backgroundUrl, (newValue, oldValue) => {
  if (newValue !== oldValue) loadWallpaper();
});

// Lifecycle hooks
onMounted(() => {
  loadWallpaper();
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$boardHeight: 240px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
  // max-width: 100%;
  // min-width: 300px;
  text-align: left;

  &.thumbnail {
    min-width: auto;
    width: 120px !important;
    height: 80px;
  }
}

.board {
  max-height: $boardHeight;
  width: 100%;
}

.kanban-list {
  max-height: 152px;
}
</style>
