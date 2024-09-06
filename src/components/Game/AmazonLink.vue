<template lang="html">
  <b-button
    v-if="amazonLink"
    variant="primary"
    :href="amazonLink"
    target="_blank"
  >
    <i class="fa-brands fa-amazon mr-1"></i>

    Buy from Amazon
  </b-button>
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
