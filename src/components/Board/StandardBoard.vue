<template lang="html">
  <div class="standard-board">
    <PageTitle :title="board.name" />
    
    <StandardList
      v-for="list in board.lists"
      :key="list.id"
      :list="list"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import StandardList from '@/components/Lists/StandardList';

export default {
  components: {
    StandardList,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isVerticalNav']),

    list() {
      const [firstList] = this.board?.lists;

      return firstList || [];
    },

    hasLists() {
      return this.board?.lists?.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.standard-board {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  flex-direction: column;
}
</style>
