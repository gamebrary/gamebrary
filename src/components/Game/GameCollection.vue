<template>
  <div v-if="gameCollection.games" class="text-left mt-3">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h3>More from the {{ gameCollection.name }} collection</h3>

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
        v-for="g in slicedGameCollection"
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

    gameCollection({ games }) {
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
      const gameCount = this.gameCollection?.games?.length;

      if (!gameCount) return;

      return Math.ceil(gameCount / GAME_CAROUSEL_PAGE_SIZE);
    },

    gameCollection() {
      return this.game?.collection || {};
    },

    slicedGameCollection() {
      const offset = GAME_CAROUSEL_PAGE_SIZE * this.page;
      return this.gameCollection?.games?.slice(offset, offset + GAME_CAROUSEL_PAGE_SIZE);
    },
  },
}
</script>
