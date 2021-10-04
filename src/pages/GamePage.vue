<template lang="html">
  <div class="pt-3 game-page" ref="gamePage">
    <!-- TODO: add  -->
    <!-- <b-button>Back to board</b-button> -->
    <b-skeleton v-if="loading" />
    <game v-else-if="game" :game="game" />

    <!-- <div class="game-backdrop" :style="`background-image: url(${backdropUrl})`" /> -->
  </div>
</template>

<script>
import Game from '@/components/Game';
import { mapState } from 'vuex';

export default {
  components: {
    Game,
  },

  data() {
    return {
      game: {},
      loading: false,
    };
  },

  computed: {
    ...mapState(['board']),

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
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-page {
  z-index: 1;
  // position: fixed;
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
