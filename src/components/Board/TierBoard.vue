<template lang="html">
  <div class="d-flex flex-column align-items-start rounded w-100 p-3">
    <TierList v-for="(list, listIndex) in board.lists" :list="list" :ref="(el) => setTierRef(listIndex, el)"
      :allGames="allGames" :listIndex="listIndex" :key="listIndex" />

    <AddTier v-if="isBoardOwner" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useBoardsStore } from '@/stores/boards';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import AddTier from '@/components/Board/AddTier';
import TierList from '@/components/Lists/TierList';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';

const boardsStore = useBoardsStore();
const uiStore = useUIStore();
const { isBoardOwner, darkTheme } = useAppGetters();

// Template refs
const tierRefs = ref({});

// Store state and getters
const board = computed(() => boardsStore.board);
const highlightedGame = computed(() => uiStore.highlightedGame);

// Computed properties
const allGames = computed(() => {
  return board.value.lists.map((list) => list.games).flat(2);
});

const hasBackground = computed(() => {
  return board.value?.backgroundUrl;
});

// Methods
const setTierRef = (listIndex, el) => {
  if (el) {
    tierRefs.value[listIndex] = el;
  }
};

const highlightGame = () => {
  const lists = Object.values(tierRefs.value);

  lists.forEach((list, index) => {
    if (!list) return;

    const [gameRef] = list.$refs?.[`${index}-${highlightedGame.value}`] || [];

    if (gameRef) {
      setTimeout(() => {
        gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, index * 1000);
    }
  });

  setTimeout(() => {
    uiStore.setHighlightedGame(null);
  }, HIGHLIGHTED_GAME_TIMEOUT);
};

const selectGame = async (gameId) => {
  const boardCopy = JSON.parse(JSON.stringify(board.value));

  boardCopy.games.push(gameId);

  try {
    await boardsStore.saveGameBoard(boardCopy);
    await boardsStore.loadBoard(boardCopy?.id, userStore.user.uid);
  } catch (e) {
    // Error handling
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
  if (highlightedGame.value) highlightGame();
});
</script>
