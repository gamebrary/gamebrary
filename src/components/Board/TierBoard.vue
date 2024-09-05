<template lang="html">
  <div class="d-flex flex-column align-items-start rounded w-100">
    <!-- <h3 :class="{ 'text-white': hasBackground || darkTheme }">
      {{ board.name }}
    </h3> -->

    <TierList
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :ref="`tier-${listIndex}`"
      :allGames="allGames"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <AddTier v-if="isBoardOwner" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AddTier from '@/components/Board/AddTier';
import TierList from '@/components/Lists/TierList';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';

export default {
  components: {
    TierList,
    AddTier,
  },

  mounted() {
    if (this.highlightedGame) this.highlightGame();
  },

  computed: {
    ...mapState(['board', 'highlightedGame']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    allGames() {
      return this.board.lists.map((list) => list.games).flat(2);
    },

    hasBackground() {
      return this.board?.backgroundUrl;
    },
  },

  methods: {
    highlightGame() {
      const lists = Object.values(this.$refs);

      lists.forEach(([list], index) => {
        const [gameRef] = list.$refs[`${index}-${this.highlightedGame}`];

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

    async selectGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board?.id);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },
  },
};
</script>
