<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<!-- TODO: add GOG 'movies' http://localhost:4000/g/8485/secret-agent -->
<template lang="html">
  <b-modal
    id="mediaModal"
    centered
    hide-footer
    size="xl"
    @show="open"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Screenshots and videos"
        :subtitle="`Source: ${selectedMedia.source}`"
        @close="close"
      >
        <template v-slot:header>
          <b-img
            :src="gameCoverUrl"
            :alt="game.name"
            class="float-left mr-2"
            height="40"
            rounded
          />
        </template>

        <!-- TODO: restore set as wallpaper -->

        <!-- <b-button
          v-if="isBoardOwner"
          class="d-none d-sm-inline"
          variant="light"
          @click="setAsWallpaper"
        >
          <i
            v-if="saving"
            class="d-sm-fas fa-sync fa-spin fa-fw"
            aria-hidden
          />
          <span v-else>Set as wallpaper</span>
        </b-button> -->
      </modal-header>
    </template>

    <div v-if="gameMedia.length" class="game-media">
      <b-embed
        v-if="selectedMedia.video"
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
        <img
          v-for="media in gameMedia"
          :key="media.imageUrl"
          :src="media.imageUrl"
          rounded
          style="height: 80px"
          class="mr-2 align-self-start"
          @click="selectedMedia = media"
        />
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      selectedMedia: {},
      activeIndex: 0,
      selectedVideoId: null,
      maxThumbnails: 3,
      saving: false,
    };
  },

  computed: {
    ...mapGetters(['isBoardOwner']),
    ...mapState(['board', 'game']),

    gameMedia() {
      // TODO: also handle thumbnails
      // TODO: do all of this in mutation after loading game
      const steamVideos = this.game?.steam?.movies?.map((video) => {
        const hiQuality = video?.mp4?.max;
        const lowQuality = video?.mp4?.[480];

        return {
          imageUrl: video.thumbnail,
          videoUrl: hiQuality || lowQuality,
          video: true,
          source: 'steam',
        }
      }) || [];

      const igdbVideos = this.game?.videos?.map((video) => {
        return {
          imageUrl: `https://img.youtube.com/vi/${video.video_id}/default.jpg`,
          videoUrl: `https://www.youtube.com/embed/${video.video_id}?rel=0&autoplay=1`,
          video: true,
          source: 'youtube',
        }
      }) || [];

      const igdbScreenshots = this.game?.screenshots?.map(({ image_id }) => ({ imageUrl: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${image_id}.jpg`, source: 'igdb', })) || [];
      const steamScreenshots = this.game?.steam?.screenshots.map(({ path_full }) => ({ imageUrl: path_full, source: 'steam' })) || [];
      const gameCover = { imageUrl: this.gameCoverUrl, source: 'igdb' }

      const wikipediaImages = this.game?.wikipedia?.lead?.image?.urls
        ? [{ imageUrl: Object.values(this.game?.wikipedia?.lead?.image?.urls)?.[0], source: 'wikipedia' }]
        : [];

      const gogImages = this.game?.gog?.gallery.map((image) => {
        const imageId = image.split('.com/')[1];

        return {
          imageUrl: imageId ? `https://images.gog-statics.com/${imageId}.jpg` : null,
          source: 'gog',
        };
      }) || [];

      return [
        ...igdbVideos,
        ...steamVideos,
        ...gogImages,
        ...steamScreenshots,
        ...igdbScreenshots,
        gameCover,
        ...wikipediaImages,
      ];
    },

    gameCoverUrl() {
      return this.game?.cover?.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${this.game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },
  },

  methods: {
    open() {
      this.selectedMedia = this.gameMedia.length > 0 ? this.gameMedia[0] : {};
    },

    async setAsWallpaper() {
      // TODO: refactor and restore
      // this.saving = true;
      //
      // const payload = {
      //   ...this.board,
      //   backgroundUrl: this.slides[this.activeIndex - 1],
      // };
      //
      // this.$store.commit('SET_ACTIVE_BOARD', payload);
      //
      // await this.$store.dispatch('SAVE_BOARD')
      //   .catch(() => {
      //     this.saving = false;
      //
      //     this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
      //   });
      //
      // this.saving = false;
      // this.$bvToast.toast('Wallpaper set');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-media {
  display: grid;
  grid-gap: 1rem;
  grid-template-rows: 50vh auto;
}

.selected-image {
  justify-self: center;
}
</style>
