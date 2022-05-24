<template lang="html">
  <div>
    <pre>{{ gameLogo }}</pre>
  </div>
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
    await this.$store.dispatch('LOAD_GAME_SPEEDRUNS', this.game.name);
    this.loadRuns();

    this.loaded = true;
  },
  computed: {
    ...mapState(['game']),

    speedruns() {
      // TODO: load runs / categories /
      return this.game?.speedruns?.data?.[0];
    },

    gameLogo() {
      return this.speedruns?.assets;
    },
  },

  methods: {
    loadRuns() {
      console.log(this.speedruns?.links);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

