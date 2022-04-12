<template lang="html">
  <section class="d-flex align-items-end">
    <!-- <pre class="bg-white text-dark ml-4 position-fixed text-small">{{ gameAgeRatings }}</pre> -->
    <!-- <pre class="bg-white text-dark ml-4 position-fixed text-small">{{ game.age_ratings }}</pre> -->
    <!-- TODO: add CERO images -->
    <!-- TODO: add USK images -->
    <!-- TODO: add GRAC images -->
    <!-- TODO: add CLASS_IND images -->
    <!-- TODO: add ACB images -->
    <!-- TODO: hook up settings -->
    <!-- <img
      v-for="rating in gameAgeRatings"
      :src="`/img/age-ratings/${rating.rating}`"
      :alt="rating.name"
      :key="rating.name"
      v-b-tooltip.hover
      :title="rating.name"
      class="ml-2 rating"
    /> -->

    <!-- <pre class="text-dark">
      {{ ratings }}
    </pre> -->
    <!-- <pre class="bg-dark text-white">{{ game.age_ratings }}</pre> -->
  </section>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    gameAgeRatings() {
      return this.$store.getters.gameAgeRatings(this.game);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.rating {
  height: 50px;

  @media(max-width: 1024px) {
    height: 40px;
  }

  @media(max-width: 768px) {
    height: 30px;
  }
}
</style>
