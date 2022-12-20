<template lang="html">
  <b-carousel
    id="carousel-fade"
    class="artworks-carousel cursor-pointer d-none d-md-block"
    fade
    v-b-modal.mediaModal
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
        url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
      }));
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.artworks-carousel {
  height: 50vh;
  overflow: hidden;

  @media(min-width: 768px) {
    margin-top: -54px;
  }
}
</style>
