<template lang="html">
  <div
    v-if="hasArtworks"
    id="carousel-fade"
    class="carousel slide game-media-carousel cursor-pointer position-absolute m-3"
    data-bs-ride="carousel"
    data-bs-interval="false"
    @click="openMediaModal"
  >
    <div class="carousel-inner rounded overflow-hidden">
      <div
        v-for="(artwork, index) in artworks"
        :key="index"
        class="carousel-item"
        :class="{ 'active': index === 0 }"
      >
        <img
          :src="artwork.url"
          class="d-block w-100"
          :alt="`Artwork ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { getImageUrl } from '@/utils';

const store = useStore();

// Store state and getters
const game = computed(() => store.state.game);
const user = computed(() => store.state.user);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const artworks = computed(() => {
  return game.value?.artworks?.map((artwork) => ({
    url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
  }));
});

const hasArtworks = computed(() => {
  return game.value?.artworks?.length > 0;
});

const hasWallpaper = computed(() => {
  return Boolean(game.value?.steam?.background);
});

// Methods
const openMediaModal = () => {
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-media-carousel {
  bottom: 0;
  width: 100px;
  height: 60px;
}
</style>
