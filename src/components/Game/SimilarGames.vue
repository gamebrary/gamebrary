<template>
  <div v-if="allGames.length">
    <h2 class="pb-3">You may also like</h2>

    <div class="scroll-container">
      <GameCard
        v-for="game in allGames"
        :key="game && game.id"
        :game-id="game.id"
        hide-platforms
        vertical
        hide-tags
        hide-progress
        class="scroll-item"
      />
    </div>
  </div>
</template>

<script>
import GameCard from '@/components/GameCard';
import { mapState } from 'vuex';

export default {
  components: {
    GameCard,
  },

  computed: {
    ...mapState(['game']),

    allGames() {
      const allGames = [
        ...this.parentGame,
        ...this.gameRemakes,
        ...this.collectionGames,
        ...this.gamePorts,
        ...this.gameRemasters,
        ...this.gameBundles,
        ...this.similarGames,
      ];

      return allGames.filter((obj, index) => (index === allGames.findIndex(o => obj.id === o.id)));
    },

    gameRemakes() {
      return this.game?.remakes || [];
    },

    collectionGames() {
      const filteredGames = this.game?.collection?.games?.filter(({ id }) => {
        const isCurrentGame = id === this.game?.id;

        return !isCurrentGame;
      })

      return filteredGames || [];
    },

    gamePorts() {
      return this.game?.ports || [];
    },

    gameRemasters() {
      return this.game?.remasters || [];
    },

    similarGames() {
      return this.game?.similar_games || [];
    },

    gameBundles() {
      return this.game?.bundles || [];
    },

    parentGame() {
      return this.game?.parent_game
        ? [this.game?.parent_game]
        : [];
    },
  },

  watch: {
    allGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .scroll-container {
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
    }

    .scroll-item {
      display: inline-block;
      width: 180px;
    }

</style>