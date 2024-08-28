<template lang="html">
  <section>
    <div class="thumbnails">
      <div
        v-for="({ imageUrl }, index) in thumbnailPreviews"
        :key="index"
      >
        <b-img
          :src="imageUrl"
          rounded
          fluid
          class="cursor-pointer"
          @click="viewMedia(index + 1)"
        />
      </div>
    </div>

    <b-modal
      id="mediaModal"
      size="xl"
      hide-footer
      scrollable
      :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :header-text-variant="darkTheme ? 'light' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :body-text-variant="darkTheme ? 'light' : 'dark'"
      @hidden="activeIndex = 0"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Screenshots and videos"
          :subtitle="subtitle"
          @close="close"
        />
      </template>

      <div class="game-media" :class="{ 'selected': activeIndex !== null }">
        <div class="modal-thumbnails">
          <div
            v-for="({ imageUrl, isVideo }, index) in gameMedia"
            class="position-relative"
            :key="index"
          >
            <i
              v-if="isVideo"
              class="fa-duotone fa-2x fa-solid fa-play position-absolute video-indicator text-light cursor-pointer"
              @click="viewMedia(index)"
            />

            <b-img
              :src="imageUrl"
              rounded
              fluid
              class="mb-3 cursor-pointer border"
              :class="{ 'border border-danger': activeIndex === index }"
              @click="viewMedia(index)"
            />
          </div>
        </div>

        <div v-if="activeIndex !== null" class="text-center w-100 d-none d-lg-inline">
          <b-embed
            v-if="isSelectedMediaVideo"
            type="iframe"
            aspect="16by9"
            :src="selectedMedia.videoUrl"
            class="rounded w-100"
            allowfullscreen
          />

          <a v-else :href="selectedMedia.imageUrl">
            <b-img
              rounded
              fluid
              :src="selectedMedia.imageUrl"
              class="cursor-pointer w-auto"
              target="_blank"
              style="max-height: 75vh;"
            />
          </a>

          <div class="text-center">
            <p>{{ subtitle }}</p>
            <p>Source: {{ selectedMedia.source }}</p>
          </div>
        </div>
      </div>
    </b-modal>
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

    thumbnailPreviews() {
      const thumbnails = this.$store.getters.gameMedia(true);

      return thumbnails?.slice(1, 6);
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

  methods: {
    viewMedia(index = 0) {
      this.activeIndex = index;
      this.$bvModal.show('mediaModal');
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
        this.$bvToast.toast('There was an error setting wallpaper', { variant: 'danger' });
      }

      this.saving = false;
      this.$bvModal.hide('mediaModal');
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
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(5, 1fr);
}

.modal-thumbnails {
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
