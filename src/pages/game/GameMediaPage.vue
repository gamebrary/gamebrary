<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<!-- TODO: get images from article and add them to media page -->
<!-- TODO: add loading placeholder -->
<template lang="html">
  <b-container fluid class="p-2">
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
          variant="light"
          class="mr-2"
          >
            <i class="fa-solid fa-chevron-left" />
        </b-button>

        Media
      </div>
    </portal>

    <p v-if="loading"></p>

    <b-row v-else>
      <b-col cols="6">
        <b-img
          :src="gameCoverUrl"
          :alt="game.name"
          class="cursor-pointer"
          rounded
          fluid
          @click.stop="openGameCover"
        />
      </b-col>

      <b-col>
        <b-img
          v-for="(thumbnail, index) in gameThumbnails"
          :key="index"
          :src="thumbnail"
          rounded
          fluid
          width="120"
          @click.stop="openModal(index)"
        />
      </b-col>
    </b-row>

    <!-- <h4 class="mt-3">Videos</h4> -->
    <!-- <b-form-row v-if="game.videos">
      <b-col
        cols="4"
        sm="4"
        md="3"
        xl="2"
        v-for="{ video_id } in game.videos"
        :key="video_id"
        class="p-1"
        @click.stop="openVideoModal(video_id)"
      >
        <b-link>
          <b-img
            fluid
            rounded
            :src="` https://img.youtube.com/vi/${video_id}/sddefault.jpg`"
          />
        </b-link>
      </b-col>
    </b-form-row> -->

    <b-modal
      id="videoModal"
      centered
      hide-footer
      size="lg"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Video"
          @close="close"
        />
      </template>

      <b-embed
        type="iframe"
        aspect="16by9"
        :src="`https://www.youtube.com/embed/${selectedVideoId}?rel=0&autoplay=1`"
        autoplay
        allowfullscreen
      />
    </b-modal>

    <b-modal
      id="game-images"
      size="xl"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Images"
          :subtitle="subtitle"
          @close="close"
        >
          <template v-slot:header>
            <b-img
              :src="gameCoverThumbUrl"
              :alt="game.name"
              class="float-left mr-2"
              height="40"
              rounded
            />
          </template>

          <b-button
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
          </b-button>

          <b-button
            variant="transparent"
            @click="previous"
          >
            <i class="fas fa-angle-left fa-fw" aria-hidden />
          </b-button>

          <b-button
            variant="transparent"
            @click="next"
          >
            <i class="fas fa-angle-right fa-fw" aria-hidden />
          </b-button>
        </modal-header>
      </template>

      <b-carousel
        ref="screenshots"
        size="xl"
        v-model="activeIndex"
      >
        <b-carousel-slide
          v-for="(screenshot, index) in gameImages"
          :key="index"
          content-tag="rounded"
        >
          <template #img>
            <b-img
              rounded
              class="d-block ml-auto mr-auto image"
              :src="screenshot"
            />
          </template>
        </b-carousel-slide>
      </b-carousel>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

// TODO: load game if not loaded
export default {
  data() {
    return {
      activeIndex: 0,
      selectedVideoId: null,
      maxThumbnails: 3,
      saving: false,
      loading: false,
    };
  },

  computed: {
    ...mapGetters(['isBoardOwner']),
    ...mapState(['board', 'game']),

    thumbnails() {
      return this.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${image_id}.jpg`)
    },

    gameCoverUrl() {
      return this.game.cover
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${this.game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },

    gameCoverThumbUrl() {
      return this.game.cover
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },

    slides() {
      return [
        ...this.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`),
      ];
    },

    screenshots() {
      return this.game?.screenshots || [];
    },

    subtitle() {
      return this.activeIndex === 0
        ? 'Game cover'
        : `Screenshot ${this.activeIndex} of ${this.gameImages.length - 1}`;
    },

    gameThumbnails() {
      const gogImages = this.game?.gog?.gallery
        ? this.game.gog.gallery.map((image) => {
          const imageId = image.split('.com/')[1];

          return imageId
            ? `https://images.gog-statics.com/${imageId}.jpg`
            : null;
        })
        : [];

      const steamImages = this.game?.steam?.screenshots
        ? this.game.steam.screenshots.map(({ path_thumbnail }) => path_thumbnail)
        : [];

      const igdbImages = this.game?.screenshots
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${image_id}.jpg`)
        : [];

      return [
        ...[this.gameCoverUrl],
        ...gogImages,
        ...steamImages,
        ...igdbImages,
      ];
    },

    gameImages() {
      const gogImages = this.game?.gog?.gallery
        ? this.game.gog.gallery.map((image) => {
          const imageId = image.split('.com/')[1];

          return imageId
            ? `https://images.gog-statics.com/${imageId}.jpg`
            : null;
        })
        : [];

      const steamImages = this.game?.steam?.screenshots
        ? this.game.steam.screenshots.map(({ path_full }) => path_full)
        : [];

      const igdbImages = this.game?.screenshots
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`)
        : [];

      return [
        ...[this.gameCoverUrl],
        ...gogImages,
        ...steamImages,
        ...igdbImages,
      ];
    },
  },

  methods: {
    openVideoModal(videoId) {
      this.$bvModal.show('videoModal');
      this.selectedVideoId = videoId;
    },

    async setAsWallpaper() {
      this.saving = true;

      const payload = {
        ...this.board,
        backgroundUrl: this.slides[this.activeIndex - 1],
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.$bus.$emit('LOAD_BOARD_BACKGROUND');
      this.saving = false;
      this.$bvToast.toast('Wallpaper set');
      this.$bvModal.hide('game-images');
    },

    previous() {
      this.$refs.screenshots.prev();
    },

    next() {
      this.$refs.screenshots.next();
    },

    setSlide(index) {
      this.$refs.screenshots.setSlide(index);
    },

    openModal(index = 0) {
      this.activeIndex = index;

      this.$bvModal.show('game-images');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.image {
  max-height: calc(100vh - 122px);
  max-width: 100%;
}
</style>
