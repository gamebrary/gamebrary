<template lang="html">
  <b-container fluid class="p-2">
    <b-skeleton v-if="loading" />
    <game-detail v-else-if="game" :game="game" />

    <!-- <div class="game-backdrop" :style="`background-image: url(${backdropUrl})`" /> -->
  </b-container>
</template>

<script>
import GameDetail from '@/components/GameDetail';
import { mapState } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';

export default {
  components: {
    GameDetail,
  },

  data() {
    return {
      gog: null,
      steamGame: null,
      loading: false,
    };
  },

  computed: {
    ...mapState(['game']),

    gameId() {
      return this.$route.params.gameId;
    },

    // backdropUrl() {
    //   const screenshots = this.game?.screenshots;
    //
    //   return screenshots.length > 0
    //     ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${screenshots[0].image_id}.jpg`
    //     : '';
    // },
    wikipediaData() {
      return this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
    },
  },

  watch: {
    gameId(gameId) {
      document.getElementsByTagName('main')[0].scrollTop = 0;

      if (gameId) this.loadGame();
      // TODO: handle missing id, redirect? 404? search?
    },
  },

  mounted() {
    // TODO: wait for access token
    this.loadGame();

    this.$store.dispatch('IGDB', { path: 'game_modes', data: 'fields *;' });
  },

  methods: {
    async loadGame() {
      const gameCached = this.game?.id === this.gameId;

      if (!this.gameId || gameCached) return;

      this.loading = true;

      await this.$store.dispatch('LOAD_GAME', this.gameId)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Error loading game', { variant: 'error' });
        });

      this.loading = false;
      this.loadSupplementalData();
    },

    async loadSupplementalData() {
      // TODO: put in constants
      const gogCategoryId = 17;
      const steamCategoryId = 13;

      const steamPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === steamCategoryId)
        : null;

      // TODO: use regex or more elegant way to get id from url
      const steamGameId = steamPage
        ? steamPage.url.split('app/')[1].split('/')[0]
        : null;

      const gogPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === gogCategoryId)
        : null;

      const wikipediaSlug = this.wikipediaData?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game.name);
      await this.$store.dispatch('LOAD_GAME_SPEEDRUNS', this.game.name);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-backdrop {
  width: 100%;
  height: 100vw;
  // position: fixed;
  // top: 0;
  backdrop-filter: grayscale(0.5) opacity(0.8) /* ...and on and on... */;
  background-repeat: no-repeat;
  background-size: contain;
  // opacity: 0.1;
  z-index: 0;
}
</style>
