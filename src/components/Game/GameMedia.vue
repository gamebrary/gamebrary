<template lang="html">
  <div>
    <section v-if="thumbnailPreviews.length > 1" class="my-2 thumbnails w-100">
      <div
        v-for="({ imageUrl }, index) in thumbnailPreviews"
        :key="index"
        :src="imageUrl"
        :class="['thumbnail cursor-pointer rounded overflow-hidden', { 'large': index < 2 }]"
        :style="`background-image: url(${imageUrl})`"
        @click="viewMedia(index)"
      >
        <span
          v-if="index === 4"
          class="more-thumbnails text-light w-100 d-flex justify-content-center h-100 align-items-center"
        >
          {{ thumbnails.length }}+
        </span>
      </div>
    </section>

    <b-modal
      id="mediaModal"
      centered
      hide-footer
      size="xl"
      :visible="visible"
      :header-bg-variant="darkTheme ? 'dark' : 'white'"
      :header-text-variant="darkTheme ? 'white' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'white'"
      :body-text-variant="darkTheme ? 'white' : 'dark'"
      @show="open"
      @hidden="close"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Screenshots and videos"
          @close="close"
        >
          <b-dropdown
            v-if="showSetAsWallpaperButton"
            variant="light"
            class="mr-2"
            menu-class="p-0"
          >
            <template #button-content>
              <b-spinner v-if="saving" small />
              <span v-else>Set as wallpaper</span>
            </template>

            <b-dropdown-item
              v-for="board in formattedBoards"
              :key="board.id"
              @click="setAsWallpaper(board)"
              class="p-0"
            >
              <b-avatar
                rounded
                :class="['board-thumbnail mr-2', { 'bg-dark' : !board.backgroundColor }]"
                :title="board.name"
                text=" "
                size="32"
                :style="`
                  background-image: url(${board.backgroundUrl ? board.backgroundUrl : ''});
                  background-color: ${board.backgroundColor ? board.backgroundColor : ''}
                  `"
              />

              {{ board.name }}
            </b-dropdown-item>
          </b-dropdown>
        </modal-header>
      </template>

      <div v-if="selectedMedia && gameMedia.length" class="game-media">
        <b-embed
          v-if="isSelectedMediaVideo"
          type="iframe"
          aspect="16by9"
          :src="selectedMedia.videoUrl"
          allowfullscreen
        />

        <b-img
          v-else
          rounded
          class="selected-image align-center align-self-center mw-100 mh-100"
          :src="selectedMedia.imageUrl"
        />

        <footer class="mt-2 d-flex overflow-auto pb-2">
          <div
            v-for="({ imageUrl, isVideo, isCover }, index) in thumbnails"
            :key="index"
          >
            <div
              class="mr-2 align-items-center text-center mb-2 rounded cursor-pointer position-relative"
            >
              <i
                v-if="isVideo"
                class="fa-solid fa-play video-indicator position-absolute text-white"
              />

              <div v-if="isCover" class="position-absolute cover-indicator text-light small w-100 bg-dark rounded-bottom">
                Cover
              </div>

              <b-img
                :src="imageUrl"
                rounded
                style="height: 80px"
                @click="viewMedia(index)"
              />
            </div>
          </div>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      activeIndex: null,
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

    thumbnails() {
      return this.$store.getters.gameMedia(true);
    },

    thumbnailPreviews() {
      return this.thumbnails?.slice(0, 5);
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

    visible() {
      return this.activeIndex !== null;
    },

    showSetAsWallpaperButton() {
      if (!this.user) return false;

      return !this.isSelectedMediaVideo && !this.isSelectedMediaCover;
    },
  },

  methods: {
    open() {
      if (this.activeIndex === null) this.activeIndex = 0;
    },

    close() {
      this.activeIndex = null;
    },

    viewMedia(index) {
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
  grid-template-rows: 1fr auto;
}

.selected-image {
  justify-self: center;
}

.video-indicator {
  left: calc(50% - 6px);
  top: calc(50% - 8px);
}

.cover-indicator {
  bottom: 0;
}

.media-button {
  padding: 21px 16px;
  height: 100%;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  // grid-template-rows: repeat(2, 3vw);
  grid-gap: .5rem;
}

.thumbnail {
  height: 60px;
  background-position: center;
  background-size: cover;
}

.more-thumbnails {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
