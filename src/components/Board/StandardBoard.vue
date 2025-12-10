<template lang="html">
  <div class="standard-board pb-5 d-flex align-items-center flex-column px-3">
    <p v-if="isEmpty">
      This board is empty.
    </p>

    <draggable class="games" v-bind="draggableProps" :list="listGames" :item-key="(gameId) => gameId"
      :move="validateMove" :disabled="draggingDisabled" @end="dragEnd" @start="dragStart">
      <template #item="{ element: gameId, index }">
        <GameCard :key="gameId" :list="list" :ref="(el) => setGameRef(gameId, el)" :game-id="gameId"
          :ranked="board.ranked" :rank="index + 1" class="mb-3" @click="openGame(gameId, list)" />
      </template>
      <template #footer>
        <button v-if="isBoardOwner" type="button" class="btn w-100 py-3"
          :class="darkTheme ? 'btn-success' : 'btn-primary'" @click="openGameSelectorSidebar">
          Add games
        </button>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useProgressesStore } from '@/stores/progresses';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useSettingsStore } from '@/stores/settings';
import { useAppGetters } from '@/stores/getters';
import { useTwitchStore } from '@/stores/twitch';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';
import draggable from 'vuedraggable';
import slugify from 'slugify';
import GameCard from '@/components/GameCard';

const route = useRoute();
const router = useRouter();
const gamesStore = useGamesStore();
const progressesStore = useProgressesStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const settingsStore = useSettingsStore();
const { darkTheme, isBoardOwner, draggableProps } = useAppGetters();
const twitchStore = useTwitchStore();
const $bus = inject('$bus');

// Template refs
const gameRefs = ref({});
const draggingId = ref(null);

// Store state and getters
const cachedGames = computed(() => gamesStore.cachedGames);
const dragging = computed(() => uiStore.dragging);
const progresses = computed(() => progressesStore.progresses);
const board = computed(() => boardsStore.board);
const user = computed(() => userStore.user);
const settings = computed(() => settingsStore.settings);
const highlightedGame = computed(() => uiStore.highlightedGame);
const boards = computed(() => boardsStore.boards);

// Computed properties
const list = computed(() => {
  const [firstList] = board.value?.lists;
  return firstList || [];
});

const needsFlattening = computed(() => {
  return board.value?.lists?.length > 0;
});

const filter = computed(() => {
  return listGames.value || [];
});

const draggingDisabled = computed(() => {
  return !user.value || !isBoardOwner.value;
});

const listGames = computed(() => {
  return list.value?.games;
});

const isEmpty = computed(() => {
  return listGames.value.length === 0;
});

const gameSelectorEventName = computed(() => {
  return `SELECT_GAME_LIST_${route.query.listIndex || 0}`;
});

// Methods
const setGameRef = (gameId, el) => {
  if (el) {
    gameRefs.value[gameId] = el;
  }
};

const highlightGame = () => {
  if (!highlightedGame.value) return;

  const gameRef = gameRefs.value[highlightedGame.value];

  if (gameRef) {
    gameRef.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setTimeout(() => {
    uiStore.setHighlightedGame(null);
  }, HIGHLIGHTED_GAME_TIMEOUT);
};

const flattenAndSaveBoard = async () => {
  const mergedGamesList = [...new Set(board.value?.lists?.map(({ games }) => games)?.flat())];

  const payload = {
    ...board.value,
    lastUpdated: Date.now(),
    lists: [{ name: '', games: mergedGamesList }],
  };

  boardsStore.setGameBoard(payload);

  await boardsStore.saveBoard();
};

const openGameSelectorSidebar = () => {
  uiStore.setGameSelectorData({
    title: `Add games to ${board.value.name}`,
    filter: filter.value,
    eventName: gameSelectorEventName.value,
  });
};

const selectGame = (gameId) => {
  if (list.value.games.includes(gameId)) {
    removeGame(gameId);
  } else {
    addGame(gameId);
  }
};

const addGame = async (gameId) => {
  const boardCopy = JSON.parse(JSON.stringify(board.value));

  boardCopy?.lists?.[0]?.games.push(gameId);

  try {
    await boardsStore.saveGameBoard(boardCopy);
    await boardsStore.loadBoard(boardCopy?.id, userStore.user.uid);
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }
    await gamesStore.loadIGDBGames(twitchStore.twitchToken, [gameId]);
  } catch (e) {
    // Error handling
  }
};

const removeGame = async (gameId) => {
  const { boardId, listIndex } = route.query;
  const boardIndex = boards.value.findIndex(({ id }) => id === boardId);
  const boardToUpdate = boards.value[boardIndex];
  const gameIndex = boardToUpdate?.lists?.[listIndex]?.games?.indexOf(gameId);

  boardToUpdate.lists[listIndex].games.splice(gameIndex, 1);

  try {
    await boardsStore.saveGameBoard(boardToUpdate);
    await boardsStore.loadBoard(boardToUpdate?.id, userStore.user.uid);
  } catch (e) {
    // Error handling
  }
};

const openGame = (id, list) => {
  const slug = slugify(cachedGames.value[id].slug, { lower: true });

  router.push({
    name: 'game',
    params: {
      id,
      slug,
      boardId: board.value?.id,
    },
  });
};

const validateMove = ({ from, to }) => {
  const sameList = from.id === to.id;
  const notInList = !board.value?.lists?.[to.id]?.games?.includes(Number(draggingId.value));

  return sameList || (notInList && !sameList);
};

const dragStart = ({ item }) => {
  uiStore.setDraggingGameId(item.id);
  draggingId.value = item.id;
};

const dragEnd = () => {
  uiStore.clearDraggingGameId();
  saveBoard();
};

const saveBoard = async () => {
  try {
    await boardsStore.saveBoard();
  } catch (e) {
    userStore.setSessionExpired(true);
  }
};

// Watchers
watch(highlightedGame, (gameId) => {
  if (gameId) {
    nextTick(() => {
      highlightGame();
    });
  }
});

// Lifecycle hooks
onMounted(() => {
  if (needsFlattening.value) flattenAndSaveBoard();
  if (highlightedGame.value) {
    nextTick(() => {
      highlightGame();
    });
  }

  $bus.$on(gameSelectorEventName.value, selectGame);
});

onBeforeUnmount(() => {
  $bus.$off(gameSelectorEventName.value, selectGame);
});
</script>

<style lang="scss" scoped>
.standard-board {
  width: 100%;
  max-width: 600px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  flex-direction: column;
  margin: 0 auto;
}
</style>
