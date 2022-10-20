<template lang="html">
  <div class="board px-3 pb-3">
    <game-list
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :listIndex="listIndex"
      :key="list.name"
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
import GameList from '@/components/Lists/GameList';

export default {
  components: {
    GameList,
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

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
