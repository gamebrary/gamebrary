<template lang="html">
  <div class="mt-3">
    <!-- TODO: add  -->
    <!-- <b-button>Back to board</b-button> -->
    <game :game="game" :loading="loading" />
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
      loading: false,
    };
  },

  computed: {
    gameId() {
      return this.$route.params.gameId;
    },
  },

  watch: {
    gameId(gameId) {
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
</style>
