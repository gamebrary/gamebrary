<template lang="html">
  <div class="grid-board pb-5 px-3">
    <p v-if="isEmpty">
      This board is empty.
    </p>

    <draggable class="game-grid" v-bind="draggableProps" :list="list.games" :item-key="(gameId) => gameId"
      :disabled="draggingDisabled" :move="validateMove" @end="dragEnd" @start="dragStart">
      <template #item="{ element: gameId, index }">
        <GameCard :key="gameId" :list="list" :ref="(el) => setGameRef(gameId, el)" :game-id="gameId"
          :ranked="board.ranked" :rank="index + 1" vertical hide-platforms @click="openGame(gameId, list)" />
      </template>
      <template #footer>
        <div v-if="isBoardOwner" class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
          @click="openGameSelectorSidebar" style="cursor: pointer;">
          <div class="card-body align-content-center text-center">
            Expand your collection!

            <button type="button" class="btn mt-2" :class="darkTheme ? 'btn-success' : 'btn-primary'">
              Add games
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useProgressesStore } from '@/stores/progresses';
import { useBoardsStore } from '@/stores/boards';
import { useUIStore } from '@/stores/ui';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';
import draggable from 'vuedraggable';
import slugify from 'slugify';
import GameCard from '@/components/GameCard';

const route = useRoute();
const router = useRouter();
const gamesStore = useGamesStore();
const progressesStore = useProgressesStore();
const boardsStore = useBoardsStore();
const uiStore = useUIStore();
const $bus = inject('$bus');

// Template refs
const gameRefs = ref({});
const draggingId = ref(null);

// Store state and getters
const cachedGames = computed(() => gamesStore.cachedGames);
const dragging = computed(() => uiStore.dragging);
const progresses = computed(() => progressesStore.progresses);
const board = computed(() => boardsStore.board);
const user = computed(() => store.state.user);
const settings = computed(() => store.state.settings);
const highlightedGame = computed(() => store.state.highlightedGame);
const boards = computed(() => store.state.boards);
const isBoardOwner = computed(() => store.getters.isBoardOwner);
const darkTheme = computed(() => store.getters.darkTheme);
const draggableProps = computed(() => store.getters.draggableProps);

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
  const gameRef = gameRefs.value[highlightedGame.value];

  if (gameRef) {
    gameRef.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setTimeout(() => {
    store.commit('SET_HIGHLIGHTED_GAME', null);
  }, HIGHLIGHTED_GAME_TIMEOUT);
};

const flattenAndSaveBoard = async () => {
  const mergedGamesList = [...new Set(board.value?.lists?.map(({ games }) => games)?.flat())];

  const payload = {
    ...board.value,
    lastUpdated: Date.now(),
    lists: [{ name: '', games: mergedGamesList }],
  };

  store.commit('SET_GAME_BOARD', payload);

  await store.dispatch('SAVE_BOARD');
};

const openGameSelectorSidebar = () => {
  store.commit('SET_GAME_SELECTOR_DATA', {
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
    await store.dispatch('SAVE_GAME_BOARD', boardCopy);
    await store.dispatch('LOAD_BOARD', boardCopy?.id);
    await store.dispatch('LOAD_IGDB_GAMES', [gameId]);
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
    await store.dispatch('SAVE_GAME_BOARD', boardToUpdate);
    await store.dispatch('LOAD_BOARD', boardToUpdate?.id);
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
  await store.dispatch('SAVE_BOARD')
    .catch(() => {
      store.commit('SET_SESSION_EXPIRED', true);
    });
};

// Lifecycle hooks
onMounted(() => {
  if (needsFlattening.value) flattenAndSaveBoard();
  if (highlightedGame.value) highlightGame();

  $bus.$on(gameSelectorEventName.value, selectGame);
});

onBeforeUnmount(() => {
  $bus.$off(gameSelectorEventName.value, selectGame);
});
</script>

<style lang="scss" scoped>
.grid-board {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
}
</style>
