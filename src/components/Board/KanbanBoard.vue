<template lang="html">
  <div class="board px-3 pb-3">
    <kanban-list
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <add-list
      v-if="isBoardOwner"
      :empty="empty"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AddList from '@/components/Board/AddList';
import KanbanList from '@/components/Lists/KanbanList';

export default {
  components: {
    KanbanList,
    AddList,
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
