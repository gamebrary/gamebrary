<!-- TODO: fix set as wallpaper logic -->
<template lang="html">
  <section>
    <masonry
      v-if="activeIndex === null"
      gutter="8px"
      :cols="{default: 4, 1000: 3, 700: 2, 400: 1}"
    >
      <b-img
        v-for="({ imageUrl }, index) in gameMedia"
        :key="index"
        :src="imageUrl"
        rounded
        fluid
        class="mb-2"
        @click="viewMedia(index)"
      />
    </masonry>

    <div v-else class="text-center w-100">
      <b-embed
        v-if="isSelectedMediaVideo"
        type="iframe"
        aspect="16by9"
        :src="selectedMedia.videoUrl"
        class="rounded w-100"
        allowfullscreen
      />

      <b-img
        v-else
        rounded
        fluid
        :src="selectedMedia.imageUrl"
        class="cursor-pointer"
        @click="activeIndex = null"
      />
    </div>

    <!-- <masonry
      v-if="activeIndex === null"
      gutter="8px"
      :cols="{default: 4, 1000: 3, 700: 2, 400: 1}"
    >
      <b-img
        v-for="({ imageUrl }, index) in gameMedia"
        :key="index"
        :src="imageUrl"
        rounded
        fluid
        class="mb-2"
        @click="viewMedia(index)"
      />
    </masonry>

    <div v-else class="text-center">
      <b-embed
        v-if="isSelectedMediaVideo"
        type="iframe"
        aspect="16by9"
        :src="selectedMedia.videoUrl"
        class="rounded"
        allowfullscreen
      />

      <b-img
        v-else
        rounded
        fluid
        :src="selectedMedia.imageUrl"
        class="cursor-pointer"
        @click="activeIndex = null"
      />
    </div> -->
    <!-- <section v-if="thumbnailPreviews.length > 1" class="my-2 thumbnails w-100">
      <div
        v-for="({ imageUrl }, index) in thumbnailPreviews"
        :key="index"
        :src="imageUrl"
        :class="['thumbnail cursor-pointer rounded overflow-hidden', { 'large': index < 2 }]"
        :style="`background-image: url(${imageUrl})`"
        @click="viewMedia"
      >
        <span
          v-if="index === 4"
          class="more-thumbnails text-light w-100 d-flex justify-content-center h-100 align-items-center"
        >
          {{ thumbnails.length }}+
        </span>
      </div>
    </section> -->

    <!-- <b-modal
      id="mediaModal"
      size="xl"
      hide-footer
      scrollable
      :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :header-text-variant="darkTheme ? 'light' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :body-text-variant="darkTheme ? 'light' : 'dark'"
      @hidden="activeIndex = null"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Screenshots and videos"
          :subtitle="subtitle"
          @close="close"
        >
          <b-button
            v-if="activeIndex !== null"
            @click.stop="activeIndex = null"
          >
            Back
          </b-button>

          <b-dropdown
            v-if="showSetAsWallpaperButton"
            variant="light"
            class="mx-2 d-none d-sm-inline-block"
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
    </b-modal> -->
  </section>
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

    showSetAsWallpaperButton() {
      if (!this.user) return false;

      console.log('activeIndex', this.activeIndex);

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
