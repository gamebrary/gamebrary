<template lang="html">
  <div class="kanban-board pl-3">
    <KanbanList
      v-for="(list, listIndex) in board.lists"
      :ref="(el) => setListRef(listIndex, el)"
      :list="list"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <AddKanbanList
      v-if="isBoardOwner"
      :empty="empty"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useBoardsStore } from '@/stores/boards';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import AddKanbanList from '@/components/Board/AddKanbanList';
import KanbanList from '@/components/Lists/KanbanList';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';

const boardsStore = useBoardsStore();
const uiStore = useUIStore();
const { isBoardOwner } = useAppGetters();

// Template refs
const listRefs = ref({});

// Store state and getters
const board = computed(() => boardsStore.board);
const highlightedGame = computed(() => uiStore.highlightedGame);

// Computed properties
const empty = computed(() => {
  return board.value?.lists?.length === 0;
});

// Methods
const setListRef = (listIndex, el) => {
  if (el) {
    listRefs.value[listIndex] = el;
  }
};

const scrollToGame = () => {
  const lists = Object.values(listRefs.value);

  lists.forEach((list, index) => {
    if (!list) return;

    const gameRef = list.$refs?.[`${index}-${highlightedGame.value}`]?.[0];

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

// Watchers
watch(highlightedGame, (gameId) => {
  if (gameId) {
    nextTick(() => {
      scrollToGame();
    });
  }
});

// Lifecycle hooks
onMounted(() => {
  if (highlightedGame.value) scrollToGame();
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.kanban-board {
  user-select: none;
  display: flex;
  align-items: flex-start;
  height: calc(100dvh - 65px);
  overflow-y: hidden;
}
</style>
