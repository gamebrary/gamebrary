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

<script>
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER } from '@/constants';
// import KanbanBoardPlaceholder from '@/components/Board/KanbanBoardPlaceholder'
import { mapState } from 'vuex';

export default {
  components: {
    // KanbanBoardPlaceholder,
  },

  computed: {
    ...mapState(['board']),

    useSpinner() {
      return [BOARD_TYPE_STANDARD, BOARD_TYPE_TIER].includes(this.board?.type)
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .board-placeholder {
    user-select: none;
    display: flex;
    align-items: flex-start;
  }
</style>
