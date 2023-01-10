<template>
  <div v-if="gameBundles" class="text-left mt-3">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h3>{{ gameName }} is included in the following bundles:</h3>

      <b-button-group v-if="pages > 1">
        <b-button :disabled="!showPrevButton" @click="page = page - 1">
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        <b-button :disabled="!showNextButton" @click="page = page + 1">
          <i class="fa-solid fa-chevron-right" />
        </b-button>
      </b-button-group>
    </div>

    <div class="game-grid">
      <router-link
        v-for="bundle in slicedGameBundles"
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
import { GAME_CAROUSEL_PAGE_SIZE } from '@/constants';

export default {
  getImageUrl,

  data() {
    return {
      page: 0,
    }
  },

  watch: {
    game(game) {
      this.page = 0;
    },

    gameBundles(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },

  computed: {
    ...mapState(['game']),

    showNextButton() {
      return this.page < this.pages - 1;
    },

    showPrevButton() {
      return this.page > 0;
    },

    pages() {
      const gameCount = this.gameBundles?.length;

      if (!gameCount) return;

      return Math.ceil(gameCount / GAME_CAROUSEL_PAGE_SIZE);
    },

    gameBundles() {
      return this.game?.bundles;
    },

    slicedGameBundles() {
      const offset = GAME_CAROUSEL_PAGE_SIZE * this.page;
      return this.gameBundles?.slice(offset, offset + GAME_CAROUSEL_PAGE_SIZE);
    },

    gameName() {
      return this.game?.name;
    },
  },
}
</script>
