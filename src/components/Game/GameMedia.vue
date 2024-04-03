<template lang="html">
  <section>
    <masonry
      gutter="1rem"
      :cols="{ default: 5, 1400: 5, 1200: 5, 768: 5, 480: 3 }"
    >
      <b-img
        v-for="({ imageUrl }, index) in slicedGameMedia"
        :key="index"
        :src="imageUrl"
        rounded
        fluid
        class="mb-3"
        @click="viewMedia(index)"
      />
    </masonry>

    <b-button
      v-if="gameMedia.length > 5"
      variant="light"
      size="sm"
      block
      @click="viewMedia(6)"
    >
      More images
    </b-button>

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
        <div class="overflow-auto thumbnails">
          <b-img
            v-for="({ imageUrl }, index) in gameMedia"
            :key="index"
            :src="imageUrl"
            rounded
            fluid
            class="mb-3 cursor-pointer border"
            :class="{ 'border border-danger': activeIndex === index }"
            @click="viewMedia(index)"
          />
        </div>


        <div v-if="activeIndex !== null" class="text-center w-100">
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

    thumbnails() {
      return this.$store.getters.gameMedia(true);
    },

    thumbnailPreviews() {
      return this.thumbnails?.slice(0, 5);
    },

    slicedGameMedia() {
      return this.gameMedia?.slice(0, 5);
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
  }
}

.thumbnails {
  max-height: calc(100vh - 129px);
}
</style>
