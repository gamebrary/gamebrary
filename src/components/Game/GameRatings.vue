<template lang="html">
  <section class="my-3">
    <b-img
      v-for="{ rating, logoFormat } in ageRatings"
      :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
      :alt="rating"
      :key="rating"
      height="60"
      class="mr-2"
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
