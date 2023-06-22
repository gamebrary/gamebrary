<template>
  <section v-if="similarGames.length">
    <div class="media-grid rounded">
      <masonry
        gutter="8px"
        :cols="{ default: 4, 1200: 3, 768: 3, 480: 2 }"
      >
        <game-card-search
          v-for="game in similarGames"
          :game="game"
          :key="game.id"
        />
      </masonry>
    </div>

    <!-- <router-link
      v-for="game in similarGames"
      :key="game.id"
      :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
    >
      <b-img
        fluid
        rounded
        :src="$options.getImageUrl(game)"
        :alt="game.name"
        img-top
      />
    </router-link> -->
  </section>
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

    similarGames() {
      return this.game?.similar_games || [];
    },
  },

  watch: {
    game(game) {
      this.page = 0;
    },

    similarGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.media-grid {
  height: calc(50vh - 94px);
  overflow: auto;
}
</style>
