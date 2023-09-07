<template lang="html">
  <header :class="[darkTheme ? 'border-dark' : 'border-light']">
    <portal v-if="user" to="headerActions">
      <b-dropdown
        :class="{ 'mr-2': !isVerticalNav }"
        :variant="darkTheme ? 'black' : 'light'"
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
