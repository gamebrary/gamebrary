<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<template lang="html">
  <b-form-row v-if="screenshots" class="mt-2">
    <b-col
      v-for="(thumbnail, index) in thumbnails"
      :key="index"
      cols="2"
      md="4"
      class="position-relative thumb"
      @click="openModal(index + 1)"
    >
      <b-img
        :src="thumbnail"
        rounded
        class="w-100 h-auto mb-2"
      />

      <span
        v-if="index === maxThumbnails - 1 && screenshots.length > maxThumbnails"
        class="more-images rounded text-white"
      >
        <i class="fas fa-images fa-fw" aria-hidden />
      </span>
    </b-col>

    <b-modal
      id="game-images"
      size="xl"
      hide-footer
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Images"
          :subtitle="game.name"
          @close="close"
        >
          <template v-slot:header>
            <b-img
              :src="activeGameCoverUrl"
              :alt="game.name"
              class="float-left mr-2"
              height="40"
              rounded
            />
          </template>

          <b-button
            variant="light"
            @click="setAsWallpaper"
          >
            <i
              v-if="saving"
              class="fas fa-sync fa-spin fa-fw"
              aria-hidden
            />
            <span v-else>Set as wallpaper</span>
          </b-button>

          <b-button
            :variant="darkTheme ? 'dark' : 'light'"
            @click="previous"
          >
            <i class="fas fa-angle-left fa-fw" aria-hidden />
          </b-button>

          <b-button
            :variant="darkTheme ? 'dark' : 'light'"
            @click="next"
          >
            <i class="fas fa-angle-right fa-fw" aria-hidden />
          </b-button>
        </modal-header>
      </template>

      <b-carousel
        ref="screenshots"
        fade
        v-model="activeImage"
      >
        <b-carousel-slide
          v-for="(screenshot, index) in slides"
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
  </b-form-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      activeImage: 0,
      maxThumbnails: 3,
      saving: false,
    };
  },

  computed: {
    ...mapGetters(['darkTheme', 'activeGameCoverUrl', 'board']),
    ...mapState(['board']),

    thumbnails() {
      // eslint-disable-next-line
      return this.trimmedScreenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_thumb/${image_id}.jpg`)
    },

    slides() {
      return [
        this.activeGameCoverUrl,
        // eslint-disable-next-line
        ...this.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`),
      ];
    },

    screenshots() {
      return this.game && this.game.screenshots ? this.game.screenshots : [];
    },

    trimmedScreenshots() {
      return this.screenshots.length > this.maxThumbnails
        ? this.screenshots.slice(0, this.maxThumbnails)
        : this.screenshots;
    },
  },

  methods: {
    async setAsWallpaper() {
      this.saving = true;

      const payload = {
        ...this.board,
        backgroundUrl: this.slides[this.activeImage],
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
      this.activeImage = index;

      this.$bvModal.show('game-images');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.thumb {
  cursor: pointer;
}

.more-images {
  position: absolute;
  left: 5px;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: calc(100% - 10px);
  height: calc(100% - .5rem);
  // padding-top: 1rem;
  background-color: rgba(0, 0, 0, .5);

  > small {
    margin: 0 2px;
  }

  > i {
    margin: 0 2px;
  }

  > span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: auto;
    text-align: center;
  }
}
</style>
