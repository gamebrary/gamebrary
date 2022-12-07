<template lang="html">
  <b-carousel
    id="carousel-fade"
    class="artworks-carousel"
    fade
    no-hover-pause
  >
    <b-carousel-slide
      v-for="(artwork, index) in artworks"
      :key="index"
      :img-src="artwork.url"
    />
  </b-carousel>
</template>

<script>
import { IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { mapState } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  computed: {
    ...mapState(['game']),

    artworks() {
      return this.game?.artworks?.map((artwork) => ({
        height: artwork.height,
        width: artwork.width,
        url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
      }));
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.artworks-carousel {
  margin-top: -54px;
}
</style>
