<template lang="html">
  <header :class="[darkTheme ? 'border-dark' : 'border-light']">
    <portal v-if="user" to="headerActions">
      <b-dropdown
        class="mr-2"
        :variant="darkTheme ? 'secondary' : 'light'"
        no-caret
      >
        <template #button-content>
          <i class="fa-solid fa-ellipsis" />
        </template>

        <b-dropdown-item-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
          Add note
        </b-dropdown-item-button>
        <b-dropdown-item v-b-modal.gameTagsModal>Edit tags</b-dropdown-item>
        <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
      </b-dropdown>
    </portal>

    <b-carousel
      v-if="hasArtworks"
      id="carousel-fade"
      class="cursor-pointer d-none d-md-block overflow-hidden carousel"
      fade
      v-b-modal.mediaModal
      no-hover-pause
    >
      <b-carousel-slide
        v-for="(artwork, index) in artworks"
        :key="index"
        :img-src="artwork.url"
        style="margin-top: -25vh;"
      />
    </b-carousel>
  </header>
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
.carousel {
  // height: 50vh;
  // margin-top: -72px;
}
</style>
