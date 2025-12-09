<template lang="html">
  <div class="card">
    <div class="card-body">
      <h4>Speedruns</h4>

      <pre>{{ speedruns }}</pre>

      <div v-for="(speedrun, index) in speedruns" :key="index" class="mb-3">
        <div class="ratio ratio-16x9">
          <iframe
            :src="speedrun.videoUrl"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
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
    this.loadSpeedruns();
  },

  computed: {
    ...mapState(['game']),

    speedruns() {
      return this.game?.speedruns
        ?.map((speedrun) => speedrun?.videos?.links?.[0]?.uri)
        ?.filter((url) => url?.includes('youtube'))
        ?.map((youtubeUrl) => {
          const youtubeId = youtubeUrl?.split('v=')?.[1]

          return {
            imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            videoUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`,
          }
        });
    },
  },

  methods: {
    async loadSpeedruns() {
      const speedRunGame = await this.$store.dispatch('GET_SPEEDRUN_GAME_ID', this.game.name);

      console.log('speedRunGame', speedRunGame);

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
