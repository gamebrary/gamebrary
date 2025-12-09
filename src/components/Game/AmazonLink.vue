<template lang="html">
  <a
    v-if="amazonLink"
    class="btn btn-primary"
    :href="amazonLink"
    target="_blank"
  >
    <i class="fa-brands fa-amazon me-1"></i>

    Buy from Amazon
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';

const store = useStore();

// Store state and getters
const game = computed(() => store.state.game);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const amazonLink = computed(() => {
  const amazonAsins = game.value?.external_games?.filter(({ category, uid }) => uid && category === WEBSITE_CATEGORIES.AMAZON)
    .map(({ uid }) => uid)
    .join('|');

  return amazonAsins
    ? `https://www.amazon.com/s?k=${amazonAsins}?tag=gamebrary0e-20`
    : null;
});
</script>
