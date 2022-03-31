<template lang="html">
  <div class="p-2 game-page" ref="gamePage">
    <!-- <pre>{{ steamGame }}</pre> -->
    <!-- <pre>{{ speedruns }}</pre> -->
    <b-skeleton v-if="loading" />
    <game v-else-if="game" :game="game" :gog="gog" :steam-game="steamGame" />

    <!-- <div class="game-backdrop" :style="`background-image: url(${backdropUrl})`" /> -->
  </div>
</template>

<script>
import Game from '@/components/Game';

export default {
  components: {
    Game,
  },

  data() {
    return {
      game: {},
      gog: null,
      speedruns: null,
      steamGame: null,
      loading: false,
    };
  },

  computed: {
    gameId() {
      return this.$route.params.gameId;
    },

    backdropUrl() {
      const screenshots = this.game && this.game.screenshots;

      return screenshots && screenshots.length
        ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${screenshots[0].image_id}.jpg`
        : '';
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
    this.loadGame();

    this.$store.dispatch('IGDB', { path: 'game_modes', data: 'fields *;' });
  },

  methods: {
    async loadGame() {
      if (!this.gameId) return;

      this.loading = true;

      this.game = await this.$store.dispatch('LOAD_GAME', this.gameId)
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

      const gogPage = this.game && this.game.websites
        ? this.game.websites.find(({ category }) => category === gogCategoryId)
        : null;

      const steamPage = this.game && this.game.websites
        ? this.game.websites.find(({ category }) => category === steamCategoryId)
        : null;
      // const hasGog =

      [this.speedruns] = (await this.$store.dispatch('LOAD_GAME_SPEEDRUNS', this.game.name)).data;

      this.gog = gogPage
        ? await this.$store.dispatch('LOAD_GOG_GAME', this.game.name)
        : null;

      // console.log(steamPage);

      // TODO: use regex or more elegant way to get id from url
      const steamGameId = steamPage
        ? steamPage.url.split('app/')[1].split('/')[0]
        : null;

      this.steamGame = steamGameId
        ? await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId)
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-page {
  z-index: 1;
}

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
