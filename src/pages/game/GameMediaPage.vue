<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<!-- TODO: get images from article and add them to media page -->
<!-- TODO: add loading placeholder -->
<template lang="html">
  <b-container fluid class="p-2">
    <b-form-row>
      <b-col cols="3">
        <b-img
          :src="gameCoverUrl"
          rounded
          fluid-grow
          @click.stop="openModal(index)"
        />
      </b-col>

      <b-col cols="7">
        <div>
          <h2>{{ game.name }}</h2>
          <p class="text-muted">
            Images
          </p>

        </div>

        <b-button @click="openGame" class="mb-2">
          Back
        </b-button>

        <div class="packery-grid">
          <b-img
            v-for="(thumbnail, index) in gameThumbnails"
            :key="index"
            :src="thumbnail"
            width="200"
            :class="index === 0 ? 'd-none' : 'image'"
            rounded
            @click.stop="openModal(index)"
          />
        </div>
      </b-col>
    </b-form-row>

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
        no-animation
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
              class="mw-100 d-block ml-auto mr-auto"
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
import Packery from 'packery';

// TODO: load game if not loaded
export default {
  data() {
    return {
      packery: null,
      activeIndex: 0,
      maxThumbnails: 3,
      saving: false,
    };
  },

  computed: {
    ...mapGetters(['isBoardOwner']),
    ...mapState(['board', 'game']),

    thumbnails() {
      // eslint-disable-next-line
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
        // eslint-disable-next-line
        ...this.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`),
      ];
    },

    screenshots() {
      return this.game && this.game.screenshots ? this.game.screenshots : [];
    },

    subtitle() {
      return this.activeIndex === 0
        ? 'Game cover'
        : `Screenshot ${this.activeIndex} of ${this.gameImages.length - 1}`;
    },

    gameThumbnails() {
      const gogImages = this.game.gog && this.game.gog.gallery
        // eslint-disable-next-line
        ? this.game.gog.gallery.map((image) => {
          const imageId = image.split('.com/')[1];

          return imageId
            ? `https://images.gog-statics.com/${imageId}.jpg`
            : null;
        })
        : [];

      const steamImages = this.game.steam && this.game.steam.screenshots
        // eslint-disable-next-line
        ? this.game.steam.screenshots.map(({ path_thumbnail }) => path_thumbnail)
        : [];

      const igdbImages = this.game && this.game.screenshots
        // eslint-disable-next-line
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
      const gogImages = this.game.gog && this.game.gog.gallery
        // eslint-disable-next-line
        ? this.game.gog.gallery.map((image) => {
          const imageId = image.split('.com/')[1];

          return imageId
            ? `https://images.gog-statics.com/${imageId}.jpg`
            : null;
        })
        : [];

      const steamImages = this.game.steam && this.game.steam.screenshots
        // eslint-disable-next-line
        ? this.game.steam.screenshots.map(({ path_full }) => path_full)
        : [];

      const igdbImages = this.game && this.game.screenshots
        // eslint-disable-next-line
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

  mounted() {
    this.packery = new Packery('.packery-grid', { itemSelector: '.image', gutter: 16 });

    this.$nextTick(() => {
      setTimeout(() => { this.layout(); }, 1000);
    });
  },

  methods: {
    layout() {
      this.packery.layout();
    },

    openGame() {
      this.$router.push({
        name: 'game',
        params: {
          gameId: this.game.id,
          gameSlug: this.game.slug,
        },
      });
    },

    async setAsWallpaper() {
      this.saving = true;

      const payload = {
        ...this.board,
        backgroundUrl: this.slides[this.activeIndex],
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
