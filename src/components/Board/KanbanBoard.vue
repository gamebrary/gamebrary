<!-- TODO: fix board height when short lists -->
<template lang="html">
  <div class="kanban-board">
    <kanban-list
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <add-kanban-list
      v-if="isBoardOwner"
      :empty="empty"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AddKanbanList from '@/components/Board/AddKanbanList';
import KanbanList from '@/components/Lists/KanbanList';

export default {
  components: {
    KanbanList,
    AddKanbanList,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isBoardOwner']),

    empty() {
      return this.board?.lists?.length === 0;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.kanban-board {
  user-select: none;
  display: flex;
  align-items: flex-start;
}
</style>
