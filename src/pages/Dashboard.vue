<template lang="html">
  <b-container-fluid>
    <b-jumbotron
      header="Gamebrary"
      header-level="5"
      fluid
      lead="The open source video game collection management tool."
    />
    <!-- background-image: linear-gradient(transparent, #222 50%), url(${ coverScreenshot }); -->
    <b-container>
      <boards />
      <page-footer />
    </b-container>
  </b-container-fluid>
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
