<!-- TODO: use search endpoint to get more accurate results -->
<template lang="html">
  <section v-if="similarGames.length" class="mt-3">
    <h3 class="my-3">You may also like</h3>

    <div class="game-grid">
      <router-link
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
      </router-link>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  computed: {
    ...mapState(['game']),

    similarGames() {
      return this.game?.similar_games || [];
    },
  },

  watch: {
    similarGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },
};
</script>
