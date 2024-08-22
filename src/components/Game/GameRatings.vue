<template lang="html">
  <b-dropdown v-if="ratings" variant="link" toggle-class="p-0" no-caret>
    <template #button-content>
      <b-img
        :src="`/img/age-ratings/${ratings.rating}.${ratings.logoFormat || 'png'}`"
        :alt="ratings.rating"
        :key="ratings.rating"
        height="60"
      />

    </template>
    
    <b-dropdown-text>
      <div class="d-flex align-items-start">
        <b-img
          v-for="{ rating, logoFormat, description } in gameRatings"
          :title="description"
          :key="rating"
          class="mr-2"
          :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
          height="60"
        />
      </div>
    </b-dropdown-text>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { AGE_RATINGS } from '@/constants';

export default {
  AGE_RATINGS,

  computed: {
    ...mapState(['game']),
    ...mapGetters(['ageRating']),

    gameRatings() {
      const formattedRatings = this.game?.age_ratings?.map(({ category, rating, content_descriptions }) => {
        const { ratings, name } = AGE_RATINGS?.find(({ id }) => id === category);
        const description = content_descriptions?.map(({ description }) => description)?.join(', ') || null;
        const ratingData = ratings[rating];

        return ratingData
          ? { rating: ratingData, description, category, name }
          : {};
      }) || [];

      return formattedRatings.filter(value => Object.keys(value).length !== 0);
    },

    ratings() {
      const preferredRating = this.gameRatings?.find(({ category }) => category === this.ageRating);

      if (preferredRating) return preferredRating;

      return this.gameRatings?.find(({ category }) => category);
    }
  },
};
</script>
