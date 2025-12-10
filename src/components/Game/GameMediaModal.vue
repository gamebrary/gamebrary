<template lang="html">
  <section>
    <div
      class="modal fade"
      id="mediaModal"
      tabindex="-1"
      aria-labelledby="mediaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
          <div class="modal-header">
            <h5 class="modal-title" id="mediaModalLabel">Screenshots and videos</h5>
            <p class="mb-0 me-2">{{ subtitle }}</p>
            <button type="button" class="btn-close" :class="darkTheme ? 'btn-close-white' : ''" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="game-media" :class="{ 'selected': activeIndex !== null }">
              <div class="thumbnails">
                <div
                  v-for="({ imageUrl, isVideo }, index) in gameMediaComputed"
                  class="position-relative"
                  :key="index"
                >
                  <i
                    v-if="isVideo"
                    class="fa-duotone fa-2x fa-solid fa-play position-absolute video-indicator text-light cursor-pointer"
                    style="left: calc(50% - 12px); top: calc(50% - 16px);"
                    @click="viewMedia(index)"
                  />

                  <img
                    :src="imageUrl"
                    class="rounded img-fluid mb-3 cursor-pointer border"
                    :class="{ 'border border-danger': activeIndex === index }"
                    @click="viewMedia(index)"
                    :alt="`Media ${index + 1}`"
                  />
                </div>
              </div>

              <div v-if="activeIndex !== null" class="text-center w-100 d-none d-lg-inline">
                <div
                  v-if="isSelectedMediaVideo"
                  class="ratio ratio-16x9 rounded w-100"
                >
                  <iframe
                    :src="selectedMedia.videoUrl"
                    class="rounded w-100"
                    allowfullscreen
                  ></iframe>
                </div>

                <a v-else :href="selectedMedia.imageUrl" target="_blank">
                  <img
                    class="rounded img-fluid cursor-pointer w-auto"
                    :src="selectedMedia.imageUrl"
                    style="max-height: 75vh;"
                    :alt="subtitle"
                  />
                </a>

                <div class="text-center">
                  <p>{{ subtitle }}</p>
                  <p>Source: {{ selectedMedia.source }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBoardsStore } from '@/stores/boards';
import { useGamesStore } from '@/stores/games';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters, useGameGetters } from '@/stores/getters';

const userStore = useUserStore();
const boardsStore = useBoardsStore();
const gamesStore = useGamesStore();
const wallpapersStore = useWallpapersStore();
const { darkTheme } = useAppGetters();

// Reactive state
const activeIndex = ref(0);
const saving = ref(false);

// Store state and getters
const user = computed(() => userStore.user);
const board = computed(() => boardsStore.board);
const game = computed(() => gamesStore.game);
const wallpapers = computed(() => wallpapersStore.wallpapers);
const boards = computed(() => boardsStore.boards);

// Game getters
const gameGetters = computed(() => game.value ? useGameGetters(game.value) : null);
const gameMedia = computed(() => gameGetters.value?.gameMedia || null);

// Computed properties
const formattedBoards = computed(() => {
  return boards.value?.map((boardItem) => ({ ...boardItem, backgroundUrl: getWallpaperUrl(boardItem?.backgroundUrl) }));
});

const isSelectedMediaVideo = computed(() => {
  return selectedMedia.value?.isVideo;
});

const gameMediaComputed = computed(() => {
  if (!gameMedia.value) return [];
  return gameMedia.value();
});

const isSelectedMediaCover = computed(() => {
  return selectedMedia.value?.isCover;
});

const selectedMedia = computed(() => {
  return gameMediaComputed.value?.[activeIndex.value];
});

const totalMedia = computed(() => {
  return gameMediaComputed.value?.length || 0;
});

const showSetAsWallpaperButton = computed(() => {
  if (!user.value) return false;

  return activeIndex.value >= 0;
});

const subtitle = computed(() => {
  if (!game.value?.name) return '';
  if (isSelectedMediaVideo.value) return `${game.value.name} - Video`;
  if (isSelectedMediaCover.value) return `${game.value.name} - Game cover`;

  return `${game.value.name} - Screenshot`;
});

// Methods
const viewMedia = (index = 0) => {
  activeIndex.value = index;
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
  }
};

const getWallpaperUrl = (url) => {
  if (!url) return null;
  if (url?.includes('igdb.com')) return url;

  return wallpapers.value?.find(({ ref }) => ref === url)?.url;
};

const setAsWallpaper = async (boardItem) => {
  try {
    saving.value = true;

    boardsStore.setActiveBoard({ ...boardItem, backgroundUrl: selectedMedia.value.imageUrl });

    await boardsStore.saveBoard();
  } catch (e) {
    showToast('There was an error setting wallpaper', 'danger');
  } finally {
    saving.value = false;
    const modalElement = document.getElementById('mediaModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }
};

const showToast = (message, variant = 'info') => {
  const toastElement = document.createElement('div');
  toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
};

// Lifecycle hooks
onMounted(() => {
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      activeIndex.value = 0;
    });
  }
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-media {
  display: grid;
  grid-gap: 1rem;

  &.selected {
    grid-template-columns: 200px 1fr;

    @media(max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
}

.thumbnails {
  max-height: calc(100vh - 124px);
  overflow-y: auto;

  @media(max-width: 992px) {
    max-height: auto;
    overflow-y: auto;
  }
}

.video-indicator {
  left: calc(50% - 12px);
  top: calc(50% - 16px);
}
</style>
