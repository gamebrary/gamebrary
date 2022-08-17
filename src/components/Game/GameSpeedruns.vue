<template lang="html">
  <b-card class="bg-info">
    <!-- <pre>{{ speedruns }}</pre> -->
    <!-- <pre>{{ gameLogo }}</pre> -->
  </b-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      loaded: false,
    }
  },

  async mounted() {
    this.loadSpeedruns();
  },
  computed: {
    ...mapState(['game']),

    speedruns() {
      return this.game?.speedruns;
    },
  },

  methods: {
    async loadSpeedruns() {
      const speedRunGame = await this.$store.dispatch('LOAD_SPEEDRUN_GAME', this.game.name);

      const game = speedRunGame?.data?.[0];
      const runsLink = game.links.find(({ rel }) => rel === 'runs')?.uri;

      await this.$store.dispatch('LOAD_GAME_SPEEDRUN_RUNS', runsLink)

      this.loaded = true;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

