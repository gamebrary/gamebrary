<template lang="html">
  <div  :style="`
    background-size: 100%;
    background-repeat: no-repeat;
  `"
  >
    <!-- background-image: linear-gradient(transparent, #222 50%), url(${ coverScreenshot }); -->
    <b-container>

    <div class="hero text-center py-5">
      <h3>Welcome to Gamebrary</h3>
      <p class="lead">The open source video game collection management tool.</p>
      <small v-if="coverGame">Screenshot from <strong>{{ coverGame.name }}</strong></small>
    </div>

      <boards />

      <page-footer />
    </b-container>
  </div>
</template>

<script>
import PageFooter from '@/components/PageFooter';
import Boards from '@/components/Boards';

export default {
  components: {
    PageFooter,
    Boards,
  },

  data() {
    return {
      activeTab: 0,
      coverGame: null,
    };
  },

  computed: {
    coverScreenshot() {
      const baseUrl = 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/';
      return this.coverGame && this.coverGame.screenshots.length
        ? `${baseUrl}${this.coverGame.screenshots[0].image_id}.jpg`
        : '';
    },
  },

  async mounted() {
    const randomNumber = Math.floor(Math.random() * 49);

    const popularGames = await this.$store.dispatch('LOAD_POPULAR_GAMES');

    this.coverGame = popularGames[randomNumber];
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.hero {
  text-shadow: 2px 3px 5px rgba(0,0,0,0.5);
}
</style>
