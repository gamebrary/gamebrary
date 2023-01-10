<template>
  <div v-if="gameBundles" class="text-left mt-3">
    <h3>{{ gameName }} is included in the following bundles:</h3>

    <div class="game-grid">
      <router-link
        v-for="bundle in gameBundles"
        :key="bundle.id"
        :to="{ name: 'game', params: { id: bundle.id, slug: bundle.slug } }"
      >
        <b-img
          :src="$options.getImageUrl(bundle)"
          :alt="bundle.name"
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
    gameBundles(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },

  computed: {
    ...mapState(['game']),

    gameBundles() {
      return this.game?.bundles;
    },

    gameName() {
      return this.game?.name;
    },
  },
}
</script>
