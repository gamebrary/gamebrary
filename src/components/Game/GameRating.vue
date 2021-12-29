<template lang="html">
  <section class="d-flex align-items-end">
    <!-- <pre>{{ game.age_ratings }}</pre> -->
    <!-- TODO: add CERO images -->
    <!-- TODO: add USK images -->
    <!-- TODO: add GRAC images -->
    <!-- TODO: add CLASS_IND images -->
    <!-- TODO: add ACB images -->
    <!-- TODO: hook up settings -->
    <img
      v-for="rating in ageRatings"
      :src="`/static/img/age-ratings/${rating}.png`"
      :alt="rating"
      :key="rating"
      class="ml-2 rating"
    />
  </section>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  data() {
    return {
      // TODO: move to constants
      ageRating: {
        categories: {
          1: 'ESRB',
          2: 'PEGI',
          3: 'CERO',
          4: 'USK',
          5: 'GRAC',
          6: 'CLASS_IND',
          7: 'ACB',
        },
        values: {
          1: '3',
          2: '7',
          3: '12',
          4: '16',
          5: '18',
          6: 'RP',
          7: 'EC',
          8: 'E',
          9: 'E10',
          10: 'T',
          11: 'M',
          12: 'AO',
          13: 'CERO_A',
          14: 'CERO_B',
          15: 'CERO_C',
          16: 'CERO_D',
          17: 'CERO_Z',
          18: 'USK_0',
          19: 'USK_6',
          20: 'USK_12',
          21: 'USK_18',
          22: 'GRAC_ALL',
          23: 'GRAC_Twelve',
          24: 'GRAC_Fifteen',
          25: 'GRAC_Eighteen',
          26: 'GRAC_TESTING',
          27: 'ClassInd-L',
          28: 'ClassInd-10',
          29: 'ClassInd-12',
          30: 'ClassInd-14',
          31: 'ClassInd-16',
          32: 'ClassInd-18',
          33: 'ACB_G',
          34: 'ACB_PG',
          35: 'ACB_M',
          36: 'ACB_MA15',
          37: 'ACB_R18',
          38: 'ACB_RC',
        },
      },
    };
  },

  computed: {
    ratings() {
      return this.game && this.game.age_ratings;
    },

    ageRatings() {
      return this.game && this.game.age_ratings
        ? this.game.age_ratings.map(({ rating }) => this.ageRating.values[rating])
        : null;
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
