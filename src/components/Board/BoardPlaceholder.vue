<template lang="html">
  <div class="board-placeholder">
    <div v-if="useSpinner" class="spinner-centered mt-5 d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- <KanbanBoardPlaceholder v-else /> -->
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER } from '@/constants';

const store = useStore();

const board = computed(() => store.state.board);

const useSpinner = computed(() => {
  return [BOARD_TYPE_STANDARD, BOARD_TYPE_TIER].includes(board.value?.type);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .board-placeholder {
    user-select: none;
    display: flex;
    align-items: flex-start;
  }
</style>
