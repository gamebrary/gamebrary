<template lang="html">
  <!-- TODO: fix grac_eighteen and check all options -->
  <section class="my-3">
    <b-img
      v-for="{ rating, id, logoFormat } in ageRatings"
      :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
      :alt="rating"
      :key="id"
      rounded
      height="60"
      class="mr-2 border"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { AGE_RATING_SYSTEMS } from '@/constants';

export default {
  computed: {
    ...mapState(['game']),

    ageRatings() {
      const formattedRatings = this.game?.age_ratings?.map(({ category, rating }) => {
        const { id, ratings } = AGE_RATING_SYSTEMS[category];
        const ratingData = ratings[rating];

        return ratingData
          ? { rating: ratingData, id }
          : {};
      }) || [];

      return formattedRatings.filter(value => Object.keys(value).length !== 0);
    },
  },
};
</script>
