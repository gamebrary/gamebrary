<template lang="html">
  <div>
    <img
      v-for="rating in ageRatings"
      :src="`/static/img/age-ratings/${rating}.png`"
      :alt="rating"
      :key="rating"
      class="mr-2 mb-2"
      style="height: 60px"
    />
  </div>
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
        },
      },
    };
  },

  computed: {
    ageRatings() {
      return this.game && this.game.age_ratings
        ? this.game.age_ratings.map(({ rating }) => this.ageRating.values[rating])
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
