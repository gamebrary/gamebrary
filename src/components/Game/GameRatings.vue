<template lang="html">
  <div>
    <img
      v-for="{ rating, logoFormat, description } in gameRatings"
      :title="description"
      :key="rating"
      class="me-2"
      :src="`/img/age-ratings/${rating}.${logoFormat || 'png'}`"
      height="60"
      :alt="description || 'Age rating'"
      data-bs-toggle="tooltip"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, nextTick } from 'vue';
import { useStore } from 'vuex';
import { AGE_RATINGS } from '@/constants';

const store = useStore();

// Store state and getters
const game = computed(() => store.state.game);
const ageRating = computed(() => store.getters.ageRating);

// Computed properties
const gameRatings = computed(() => {
  const formattedRatings = game.value?.age_ratings?.map(({ category, rating, content_descriptions }) => {
    const ageRatingData = AGE_RATINGS?.find(({ id }) => id === category);

    if (!ageRatingData) {
      return {};
    }

    const { ratings, name } = ageRatingData;
    const description = content_descriptions?.map(({ description }) => description)?.join(', ') || null;
    const ratingData = ratings?.[rating];

    return ratingData
      ? { rating: ratingData, description, category, name }
      : {};
  }) || [];

  return formattedRatings.filter(value => Object.keys(value).length !== 0);
});

const ratings = computed(() => {
  const preferredRating = gameRatings.value?.find(({ category }) => category === ageRating.value);

  if (preferredRating) return preferredRating;

  return gameRatings.value?.find(({ category }) => category);
});

// Methods
const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

// Lifecycle hooks
onMounted(() => {
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});
</script>
