<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<!-- TODO: get images from article and add them to media page -->
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
        :subtitle="selectedMedia.source"
        @close="close"
      >
        <!-- <template v-slot:header>
          <b-img
            :src="gameCoverThumbUrl"
            :alt="game.name"
            class="float-left mr-2"
            height="40"
            rounded
          />
        </template> -->

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
        class="align-center align-self-center justify-self-center mw-100 mh-100"
        :src="selectedMedia.imageUrl"
      />

      <footer class="mt-2 d-flex overflow-auto pb-2">
        <b-img
          v-for="media in gameMedia"
          :key="media.imageUrl"
          :src="media.imageUrl"
          width="120"
          rounded
          fluid
          class="mr-2 align-self-start"
          @click="selectedMedia = media"
        />
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

// TODO: load game if not loaded
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
      const igdbVideos = this.game?.videos?.map((video) => {
        return {
          imageUrl: `https://img.youtube.com/vi/${video.video_id}/sddefault.jpg`,
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

  // mounted() {
  //   this.$bvModal.show('mediaModal');
  // },

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
      // this.$bus.$emit('LOAD_BOARD_BACKGROUND');
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
</style>
