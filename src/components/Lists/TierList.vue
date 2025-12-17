<template lang="html">
  <div class="d-flex w-100 align-items-start mb-2 pl-3">
    <div class="d-flex flex-column d-md-none">
      <div class="rounded-circle cursor-pointer d-flex align-items-center justify-content-center" :title="list.name"
        :style="`background-color: ${list.backgroundColor}; width: 92px; height: 92px;`" data-bs-toggle="tooltip"
        data-bs-placement="right" @click="editList">
        <span class="fw-bold">{{ tierLetter }}</span>
      </div>

      <div v-if="user && isBoardOwner" class="btn-group btn-group-sm mt-1" role="group">
        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="listIndex === 0" :title="'Move up'" data-bs-toggle="tooltip" data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)">
          <i class="fa-regular fa-caret-up fa-fw" />
        </button>

        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :title="`Add games to ${list.name}`" data-bs-toggle="tooltip" data-bs-placement="right"
          @click="openGameSelectorSidebar">
          <i class="fa-solid fa-plus fa-fw" />
        </button>

        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="moveListRightButtonDisabled" :title="'Move down'" data-bs-toggle="tooltip"
          data-bs-placement="right" @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)">
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
      </div>
    </div>

    <div class="d-none d-md-flex">
      <div class="rounded-circle cursor-pointer d-flex align-items-center justify-content-center" :title="list.name"
        :style="`background-color: ${list.backgroundColor}; width: 128px; height: 128px;`" data-bs-toggle="tooltip"
        data-bs-placement="right" @click="editList">
        <span class="fw-bold fs-4">{{ tierLetter }}</span>
      </div>

      <div v-if="user && isBoardOwner" class="btn-group-vertical btn-group-sm ms-2" role="group">
        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="listIndex === 0" :title="'Move up'" data-bs-toggle="tooltip" data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)">
          <i class="fa-regular fa-caret-up fa-fw" />
        </button>

        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :title="`Add games to ${list.name}`" data-bs-toggle="tooltip" data-bs-placement="right"
          @click="openGameSelectorSidebar">
          <i class="fa-solid fa-plus fa-fw" />
        </button>

        <button type="button" class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="moveListRightButtonDisabled" :title="'Move down'" data-bs-toggle="tooltip"
          data-bs-placement="right" @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)">
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
      </div>
    </div>

    <draggable class="tier-game w-100 d-flex ml-2" v-bind="draggableProps" :list="list.games" :id="listIndex"
      :item-key="(gameId) => gameId" :move="validateMove" :disabled="draggingDisabled" @end="dragEnd"
      @start="dragStart">
      <template #item="{ element: gameId }">
        <GameCard :key="gameId" :game-id="gameId" :ref="`${listIndex}-${gameId}`" hide-title hide-tags hide-notes
          hide-progress hide-platforms class="mr-2 mb-2" vertical slim fluid small />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useProgressesStore } from '@/stores/progresses';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useSettingsStore } from '@/stores/settings';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import draggable from 'vuedraggable';
import GameCard from '@/components/GameCard';

const props = defineProps({
  allGames: Array,
  list: {
    type: Object,
    default: () => ({}),
  },
  listIndex: Number,
});

const route = useRoute();
const gamesStore = useGamesStore();
const progressesStore = useProgressesStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const uiStore = useUIStore();
const { isBoardOwner, draggableProps, darkTheme } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const draggingId = ref(null);
const editing = ref(false);

// Store state and getters
const dragging = computed(() => uiStore.dragging);
const progresses = computed(() => progressesStore.progresses);
const board = computed(() => boardsStore.board);
const user = computed(() => userStore.user);
const settings = computed(() => settingsStore.settings);
const boards = computed(() => boardsStore.boards);

// Computed properties
const moveListRightButtonDisabled = computed(() => {
  const listsCount = board.value?.lists?.length || 0;
  return props.listIndex >= listsCount - 1;
});

const tierLetter = computed(() => {
  return props.list.name?.charAt(0);
});

const tierActionVariant = computed(() => {
  if (board.value?.backgroundUrl) {
    return darkTheme.value ? 'light' : 'secondary';
  }

  return darkTheme.value ? 'outline-light' : 'secondary';
});

const draggingDisabled = computed(() => {
  return !user.value || !isBoardOwner.value;
});

const isEmpty = computed(() => {
  return props.list.games.length === 0;
});

const gameSelectorEventName = computed(() => {
  return `SELECT_GAME_LIST_${props.listIndex}`;
});

// Methods
const openGameSelectorSidebar = () => {
  uiStore.setGameSelectorData({
    title: `Add games to ${props.list.name}`,
    filter: props.list.games,
    eventName: gameSelectorEventName.value,
  });
};

const selectGame = (gameId) => {
  return props.list.games.includes(gameId)
    ? removeGame(gameId)
    : addGame(gameId);
};

const addGame = async (gameId) => {
  const boardCopy = JSON.parse(JSON.stringify(board.value));

  boardCopy?.lists?.[props.listIndex]?.games.push(gameId);

  try {
    await boardsStore.saveGameBoard(boardCopy);
    await boardsStore.loadBoard(boardCopy.id, user.value?.uid);
    const { useTwitchStore } = await import('@/stores/twitch');
    const twitchStore = useTwitchStore();
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }
    await gamesStore.loadIGDBGames(twitchStore.twitchToken, [gameId]);
    // Toast notification can be added here if needed
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
    await boardsStore.loadBoard(boardToUpdate.id, user.value?.uid);
  } catch (e) {
    // Error handling
  }
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

const editList = () => {
  if (user.value && isBoardOwner.value) {
    uiStore.setActiveBoardListIndex(props.listIndex);
  }
};

const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

// Lifecycle hooks
onMounted(() => {
  $bus.$on(gameSelectorEventName.value, selectGame);
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});

onBeforeUnmount(() => {
  $bus.$off(gameSelectorEventName.value, selectGame);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tier-game {
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
