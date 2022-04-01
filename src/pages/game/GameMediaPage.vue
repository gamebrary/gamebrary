<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<!-- TODO: get images from article and add them to media page -->
<template lang="html">
  <b-container fluid class="p-2">
    <b-form-row>
      <b-col cols="3">
        <b-img
          :src="gameCoverUrl"
          :alt="game.name"
          class="cursor-pointer game-cover"
          fluid-grow
          rounded
        />
      </b-col>

      <b-col cols="9">
        <b-img
          v-for="(thumbnail, index) in thumbnails"
          :key="index"
          :src="thumbnail"
          img-alt="Image"
          width="200"
          img-top
          rounded
          @click.stop="openModal(index)"
        />
      </b-col>
    </b-form-row>

    <b-button @click="openGame">Back to Game</b-button>

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
          <!-- TODO Display image source igdb, instagram, etc... -->
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
            v-if="isBoardOwner"
            class="d-none d-sm-inline"
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
            @click="previous"
          >
            <i class="fas fa-angle-left fa-fw" aria-hidden />
          </b-button>

          <b-button
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
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

// TODO: load game if not loaded
export default {
  data() {
    return {
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
        : '/static/no-image.jpg';
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
      if (this.activeIndex === 0) {
        return 'Game cover';
      }

      return `Screenshot ${this.activeIndex} of ${this.slides.length - 1}`;
    },
  },

  methods: {
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
