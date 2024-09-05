<template lang="html">
  <div class="kanban-board">
    <KanbanList
      v-for="(list, listIndex) in board.lists"
      :ref="`list-${listIndex}`"
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

<script>
import { mapState, mapGetters } from 'vuex';
import AddKanbanList from '@/components/Board/AddKanbanList';
import KanbanList from '@/components/Lists/KanbanList';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants'

export default {
  components: {
    KanbanList,
    AddKanbanList,
  },

  mounted() {
    if (this.highlightedGame) this.scrollToGame();
  },

  computed: {
    ...mapState(['board', 'highlightedGame']),
    ...mapGetters(['isBoardOwner']),

    empty() {
      return this.board?.lists?.length === 0;
    },
  },

  methods: {
    scrollToGame() {
      const lists = Object.values(this.$refs);

      lists.forEach(([list], index) => {
        const gameRef = list.$refs[`${index}-${this.highlightedGame}`]?.[0];

        if (gameRef) {
          setTimeout(() => {
            gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, index * 1000);
        }
      });

      setTimeout(() => {
        this.$store.commit('SET_HIGHLIGHTED_GAME', null);
      }, HIGHLIGHTED_GAME_TIMEOUT);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.kanban-board {
  user-select: none;
  display: flex;
  align-items: flex-start;
  // width: 100vw;
  height: 100%;
}
</style>
