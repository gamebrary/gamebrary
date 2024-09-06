<template lang="html">
  <div class="standard-board pb-5">
    <StandardList
      v-for="(list, listIndex) in board.lists"
      :ref="`list-${listIndex}`"
      :key="list.id"
      :listIndex="listIndex"
      :list="list"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import StandardList from '@/components/Lists/StandardList';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';
export default {
  components: {
    StandardList,
  },

  computed: {
    ...mapState(['board', 'highlightedGame']),

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
    if (this.highlightedGame) this.highlightGame();
  },

  methods: {
    highlightGame() {
      const lists = Object.values(this.$refs);

      lists.forEach(([list], index) => {
        const [gameRef] = list.$refs[`${index}-${this.highlightedGame}`];

        if (gameRef) {
          console.log('gameRef', gameRef);

          setTimeout(() => {
            gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, index * 1000);
        }
      });

      setTimeout(() => {
        this.$store.commit('SET_HIGHLIGHTED_GAME', null);
      }, HIGHLIGHTED_GAME_TIMEOUT);
    },

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
}
</style>
