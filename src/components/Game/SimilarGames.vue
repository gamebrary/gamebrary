<template>
  <masonry
    v-if="allGames.length"
    gutter="16px"
    :cols="{ default: 3, 1200: 2, 768: 3, 480: 2 }"
  >
    <game-card-search
      v-for="game in allGames"
      :game="game"
      :key="game && game.id"
    />
  </masonry>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  components: {
    GameCardSearch,
  },

  getImageUrl,

  computed: {
    ...mapState(['game']),

    allGames() {
      return [
        ...this.parentGame,
        ...this.gameRemakes,
        ...this.collectionGames,
        ...this.gamePorts,
        ...this.gameRemasters,
        ...this.gameBundles,
        ...this.similarGames,
      ]
    },

    gameRemakes() {
      return this.game?.remakes || [];
    },

    collectionGames() {
      return this.game?.collection?.games || [];
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
    game(game) {
      this.page = 0;
    },

    gameRemakes(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    similarGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    gameBundles(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    gameRemasters(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    collectionGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },
};
</script>
