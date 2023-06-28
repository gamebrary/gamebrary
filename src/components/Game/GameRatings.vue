<template lang="html">
  <div v-if="ageRating === 'all'">
    <b-img
      v-for="{ rating, logoFormat, descriptions } in gameRatings"
      :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
      :alt="rating"
      :key="rating"
      :title="descriptions || rating"
      v-b-tooltip
      height="60"
      class="mr-2 mb-2"
    />
  </div>

  <b-dropdown v-else-if="preferredRating" variant="link" toggle-class="p-0 mr-2 mb-2" no-caret>
    <template #button-content>
      <b-img
        :src="`/img/age-ratings/${preferredRating.rating}.${preferredRating.logoFormat || 'png'}`"
        :alt="preferredRating.rating"
        :key="preferredRating.rating"
        height="60"
      />
    </template>
    <b-dropdown-text href="#"
      v-for="{ rating, logoFormat, descriptions } in gameRatings"
      v-b-tooltip.right
      :title="descriptions"
      :key="rating"
    >
      <b-img
        :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
        width="40"
      />

      {{ rating }}
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
        const { ratings } = AGE_RATINGS?.find(({ id }) => id === category);
        const descriptions = content_descriptions?.map(({ description }) => description)?.join(', ') || null;
        const ratingData = ratings[rating];

        return ratingData
          ? { rating: ratingData, descriptions, category }
          : {};
      }) || [];

      return formattedRatings.filter(value => Object.keys(value).length !== 0);
    },

    preferredRating() {
      return this.gameRatings?.find(({ category }) => category === this.ageRating);
    },
  },
};
</script>
