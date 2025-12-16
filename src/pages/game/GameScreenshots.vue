<template>
  <div class="tab-pane fade show active">
    <div v-if="gameMedia.length" class="game-screenshots">
      <div class="row g-3">
        <div
          v-for="(media, index) in gameMedia"
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="screenshot-item position-relative">
            <img
              :src="media.imageUrl"
              :alt="`Screenshot ${index + 1}`"
              class="img-fluid rounded cursor-pointer"
              @click="openMediaModal(index)"
            />
            <i
              v-if="media.isVideo"
              class="fa-solid fa-play position-absolute top-50 start-50 translate-middle text-white"
              style="font-size: 2rem; text-shadow: 0 0 10px rgba(0,0,0,0.8);"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-muted py-5">
      <i class="fa-regular fa-image fa-3x mb-3"></i>
      <p>No screenshots available</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useGameGetters } from '@/stores/getters';

const gamesStore = useGamesStore();

const game = computed(() => gamesStore.game);
const gameGetters = computed(() => game.value ? useGameGetters(game.value) : null);
const gameMedia = computed(() => {
  if (!gameGetters.value) return [];
  return gameGetters.value.gameMedia(false).filter(media => !media.isCover);
});

const openMediaModal = (index) => {
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    // Set active index if the modal supports it
    setTimeout(() => {
      const carousel = modalElement.querySelector('#carousel-fade');
      if (carousel) {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) {
          bsCarousel.to(index);
        }
      }
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
.screenshot-item {
  img {
    width: 100%;
    height: auto;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>

