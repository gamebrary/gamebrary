<template lang="html">
  <div class="kanban-board">
    <kanban-list
      v-for="(list, listIndex) in board.lists"
      :ref="`list-${listIndex}`"
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

  mounted() {
    if (this.highlightedGameId) this.highlightGame();
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isBoardOwner']),

    empty() {
      return this.board?.lists?.length === 0;
    },

    highlightedGameId() {
      return this.$route.query?.g;
    },
  },

  methods: {
    highlightGame() {
      const lists = Object.values(this.$refs);

      lists.forEach(([list], index) => {
        const gameRef = list.$refs[`${index}-${this.highlightedGameId}`]?.[0];

        if (gameRef) {
          setTimeout(() => {
            gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, index * 1000);
        }
      });

      setTimeout(() => {
        this.$router.replace({ name: 'board', params: this.$route.params, query: {} })
      }, 5000);
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
