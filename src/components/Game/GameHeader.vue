<template lang="html">
  <header :class="[darkTheme ? 'border-dark' : 'border-light']">
    <!-- <b-carousel
      v-if="hasArtworks"
      id="carousel-fade"
      class="cursor-pointer overflow-hidden d-none d-md-block"
      style="height: 80vh"
      fade
      v-b-modal.mediaModal
      no-hover-pause
    >
      <b-carousel-slide
        v-for="(artwork, index) in artworks"
        :key="index"
        :img-src="artwork.url"
      />
    </b-carousel> -->
  </header>
</template>

<script>
import { IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  computed: {
    ...mapState(['game', 'user']),
    ...mapGetters(['darkTheme', 'isVerticalNav']),

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
