<template lang="html">
  <div
    class="card overflow-hidden rounded p-0"
    :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
  >
    <router-link
      v-if="board?.id && !noLink"
      :to="{ name: 'board', params: { id: board.id } }"
    >
      <div
        :style="backgroundSyle"
        class="mini-board overflow-hidden"
        :class="{ thumbnail }"
      >
        <h4
          v-if="!thumbnail"
          class="px-2 py-2"
          :class="{ 'text-white': hasCustomBackground || darkTheme }"
        >
          {{ board.name }}
        </h4>

        <span
          v-if="showPublicIndicator"
          class="badge position-absolute m-1"
          :class="darkTheme ? 'bg-warning' : 'bg-danger'"
          style="right: 0; top: 0; font-size: 0.75rem;"
        >
          Public
        </span>

        <component
          :is="miniBoardComponent"
          :board="formattedBoard"
        />
      </div>
    </router-link>
    <div v-else>
      <div
        :style="backgroundSyle"
        class="mini-board overflow-hidden"
        :class="{ thumbnail }"
      >
        <h4
          v-if="!thumbnail"
          class="px-2 py-2"
          :class="{ 'text-white': hasCustomBackground || darkTheme }"
        >
          {{ board?.name }}
        </h4>

        <span
          v-if="showPublicIndicator"
          class="badge position-absolute m-1"
          :class="darkTheme ? 'bg-warning' : 'bg-danger'"
          style="right: 0; top: 0; font-size: 0.75rem;"
        >
          Public
        </span>

        <component
          v-if="formattedBoard"
          :is="miniBoardComponent"
          :board="formattedBoard"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER, BOARD_TYPE_GRID, IMAGE_SIZE_THUMB } from '@/constants';
import { getImageUrl } from '@/utils';
import StandardMiniBoard from '@/components/MiniBoards/StandardMiniBoard';
import GridMiniBoard from '@/components/MiniBoards/GridMiniBoard';
import KanbanMiniBoard from '@/components/MiniBoards/KanbanMiniBoard';
import TierMiniBoard from '@/components/MiniBoards/TierMiniBoard';

const props = defineProps({
  board: Object,
  thumbnail: Boolean,
  noLink: Boolean,
});

const route = useRoute();
const store = useStore();

// Reactive state
const backgroundUrl = ref('');

// Store state and getters
const cachedGames = computed(() => store.state.cachedGames);
const game = computed(() => store.state.game);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const miniBoardComponent = computed(() => {
  if (props.board?.type === BOARD_TYPE_TIER) return 'TierMiniBoard';
  if (props.board?.type === BOARD_TYPE_STANDARD) return 'StandardMiniBoard';
  if (props.board?.type === BOARD_TYPE_GRID) return 'GridMiniBoard';

  return 'KanbanMiniBoard';
});

const formattedBoard = computed(() => {
  const formattedLists = props.board?.lists?.map((list) => ({
    ...list,
    games: list?.games?.map((game) => {
      if (!game) return {};

      const cachedGame = cachedGames.value?.[Number(game)] || {};

      return {
        id: cachedGame.id,
        name: cachedGame.name,
        src: getImageUrl(cachedGames.value?.[Number(game)], IMAGE_SIZE_THUMB, true),
      };
    }),
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
const loadWallpaper = async () => {
  if (props.board?.backgroundUrl) {
    backgroundUrl.value = props.board?.backgroundUrl?.includes('igdb')
      ? props.board?.backgroundUrl
      : await store.dispatch('LOAD_FIREBASE_IMAGE', props.board?.backgroundUrl);
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
