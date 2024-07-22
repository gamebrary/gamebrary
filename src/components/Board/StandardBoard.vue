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
import { mapState } from 'vuex';
import StandardList from '@/components/Lists/StandardList';

export default {
  components: {
    StandardList,
  },

  computed: {
    ...mapState(['board']),

    list() {
      const [firstList] = this.board?.lists;

      return firstList || [];
    },

    needsFlattening() {
      return this.board?.lists?.length && this.board.type === 'standard';
    },

    hasLists() {
      return this.board?.lists?.length > 0;
    },
  },

  mounted() {
    if (this.needsFlattening) this.flattenAndSaveBoard();
  },

  methods: {
    async flattenAndSaveBoard() {
      const mergedGamesList = [...new Set(this.board?.lists?.map(({ games }) => games)?.flat())];

      const payload = {
        ...this.board,
        lastUpdated: Date.now(),
        lists: [{ name: '', games: mergedGamesList }],
      }
      
      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD');
    },

    flattenBoard() {
      this.$store.commit('FLATTEN_BOARD');
    },
  }
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
