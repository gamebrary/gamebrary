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
                  v-for="({ imageUrl, isVideo }, index) in gameMedia"
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

<script>
import { mapGetters, mapState } from 'vuex';

export default {

  data() {
    return {
      activeIndex: 0,
      saving: false,
    };
  },

  computed: {
    ...mapState(['user', 'board', 'game', 'wallpapers', 'boards']),
    ...mapGetters(['darkTheme']),

    formattedBoards() {
      return this.boards?.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board?.backgroundUrl) }));
    },

    isSelectedMediaVideo() {
      return this.selectedMedia?.isVideo;
    },

    gameMedia() {
      return this.$store.getters.gameMedia();
    },

    isSelectedMediaCover() {
      return this.selectedMedia?.isCover;
    },

    selectedMedia() {
      return this.gameMedia?.[this.activeIndex];
    },

    totalMedia() {
      return this.gameMedia?.length || 0;
    },

    showSetAsWallpaperButton() {
      if (!this.user) return false;

      return this.activeIndex >= 0;
    },

    subtitle() {
      if (!this.game?.name) return '';
      if (this.isSelectedMediaVideo) return `${this.game.name} - Video`;
      if (this.isSelectedMediaCover) return `${this.game.name} - Game cover`;

      return `${this.game.name} - Screenshot`;
    },
  },

  mounted() {
    const modalElement = document.getElementById('mediaModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.activeIndex = 0;
      });
    }
  },

  methods: {
    viewMedia(index = 0) {
      this.activeIndex = index;
      const modalElement = document.getElementById('mediaModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    getWallpaperUrl(url) {
      if (!url) return null;
      if (url?.includes('igdb.com')) return url;

      return this.wallpapers?.find(({ ref }) => ref === url)?.url;
    },

    async setAsWallpaper(board) {
      try {
        this.saving = true;

        this.$store.commit('SET_ACTIVE_BOARD', { ...board, backgroundUrl: this.selectedMedia.imageUrl });

        await this.$store.dispatch('SAVE_BOARD');
      } catch (e) {
        this.showToast('There was an error setting wallpaper', 'danger');
      }

      this.saving = false;
      const modalElement = document.getElementById('mediaModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    },

    showToast(message, variant = 'info') {
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
    },
  },
};
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
