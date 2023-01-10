<template>
  <div v-if="gameCollection.games" class="text-left mt-3">
    <h3 class="mb-3">More from the {{ gameCollection.name }} collection</h3>

    <div class="game-grid">
      <router-link
        v-for="g in gameCollection.games"
        :key="g.id"
        :to="{ name: 'game', params: { id: g.id, slug: g.slug } }"
      >
        <b-img
          :src="$options.getImageUrl(g)"
          :alt="g.name"
          rounded
          fluid
        />
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  watch: {
    gameCollection({ games }) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },

  computed: {
    ...mapState(['game']),

    gameCollection() {
      return this.game?.collection || {};
    },
  },
}
</script>
