<template lang="html">
  <div class="board-placeholder">
    <b-spinner
      v-if="board.type === 'list'"
      class="spinner-centered mt-5"
    />

    <kanban-board-placeholder v-else />
  </div>
</template>

<script>
import KanbanBoardPlaceholder from '@/components/Board/KanbanBoardPlaceholder'
import { mapState } from 'vuex';

export default {
  components: {
    KanbanBoardPlaceholder,
  },

  computed: {
    ...mapState(['board']),
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
