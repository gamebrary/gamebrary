<template lang="html">
  <section v-if="similarGames.length" class="mt-3">
    <div class="d-flex align-items-center justify-content-between mb-2 w-100">
      <h3>You may also like</h3>

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
        v-for="game in slicedSimilarGames"
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
import { GAME_CAROUSEL_PAGE_SIZE } from '@/constants';

export default {
  getImageUrl,

  data() {
    return {
      page: 0,
    }
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
      const gameCount = this.similarGames?.length;

      if (!gameCount) return;

      return Math.ceil(gameCount / GAME_CAROUSEL_PAGE_SIZE);
    },

    similarGames() {
      return this.game?.similar_games || [];
    },

    slicedSimilarGames() {
      const offset = GAME_CAROUSEL_PAGE_SIZE * this.page;
      return this.similarGames?.slice(offset, offset + GAME_CAROUSEL_PAGE_SIZE);
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
