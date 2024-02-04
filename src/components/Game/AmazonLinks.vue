<template lang="html">
  <b-link
    v-if="amazonLink"
    v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
    title="Using this link helps support Gamebrary at to extra cost to you."
    :href="amazonLink"
    target="_blank"
  >
    <img
      :src="`/img/available-at-amazon-${darkTheme ? 'light' : 'dark'}.png`"
      width="90"
    >
  </b-link>
</template>

<script>
import { WEBSITE_CATEGORIES } from '@/constants';
import { mapState, mapGetters } from 'vuex';


export default {
  computed: {
    ...mapState(['game']),
    ...mapGetters(['darkTheme']),

    amazonLink() {
      const amazonAsins = this.game?.external_games?.filter(({ category, uid }) => uid && category === WEBSITE_CATEGORIES.AMAZON)
        .map(({ uid }) => uid)
        .join('|');

      return amazonAsins
        ? `https://www.amazon.com/s?k=${amazonAsins}?tag=gamebrary0e-20`
        : null;
    },
  },
};
</script>
