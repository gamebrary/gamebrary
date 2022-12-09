<template lang="html">
  <b-card>
    <h4>Speedruns</h4>
    <script type="application/javascript" src="https://embed.nicovideo.jp/watch/sm21377548/script?w=640&h=360"></script><noscript><a href="https://www.nicovideo.jp/watch/sm21377548">【SFC】ロックマンX any% RTA in 31:50.79</a></noscript>

    <iframe src="https://player.twitch.tv/?video=45553437&parent=https://gamebrary.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>

    <div v-for="(speedrun, index) in speedruns" :key="index">
      <a :href="speedrun">{{ speedrun }}</a>
    </div>
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
      return this.game?.speedruns?.map(({ videos }) => {
        return videos?.links?.map((link) => link?.uri)
          .filter((item) => Boolean(item))?.[0];
      });
    },
  },

  methods: {
    async loadSpeedruns() {
      await this.$store.dispatch('GET_SPEEDRUN_GAME_ID', this.game.name);

      // const game = speedRunGame?.data?.[0];
      // const runsLink = game.links.find(({ rel }) => rel === 'runs')?.uri;

      // await this.$store.dispatch('LOAD_GAME_SPEEDRUN_RUNS', runsLink)

      // this.loaded = true;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

