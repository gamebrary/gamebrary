<template lang="html">
  <section class="my-3">
    <b-img
      v-for="{ rating, logoFormat, descriptions } in ageRatings"
      :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
      :alt="rating"
      :key="rating"
      :title="descriptions"
      v-b-tooltip
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
      const formattedRatings = this.game?.age_ratings?.map(({ category, rating, content_descriptions }) => {
        const { ratings } = AGE_RATING_SYSTEMS[category];
        const descriptions = content_descriptions?.map(({ description }) => description)?.join(', ') || [];
        const ratingData = ratings[rating];

        return ratingData
          ? { rating: ratingData, descriptions }
          : {};
      }) || [];

      return formattedRatings.filter(value => Object.keys(value).length !== 0);
    },
  },
};
</script>
