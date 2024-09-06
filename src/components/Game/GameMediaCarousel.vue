<template lang="html">
  <b-carousel
    v-if="hasArtworks"
    id="carousel-fade"
    class="game-media-carousel cursor-pointer overflow-hidden position-absolute m-3 rounded"
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
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  computed: {
    ...mapState(['game', 'user']),
    ...mapGetters(['darkTheme']),

    artworks() {
      return this.game?.artworks?.map((artwork) => ({
        url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
      }));
    },

    hasArtworks() {
      return this.game?.artworks?.length > 0;
    },

    hasWallpaper() {
      return Boolean(this.game?.steam?.background);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-media-carousel {
  bottom: 0;
  width: 160px;
}
</style>
