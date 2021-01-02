<template lang="html">
  <b-form-row v-if="screenshots" class="mt-2 justify-content-center">
    <b-col
      v-for="(thumbnail, index) in thumbnails"
      :key="index"
      cols="2"
      md="6"
      lg="4"
      class="position-relative thumb"
      @click="openModal(index)"
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
        <small>{{ screenshots.length }}</small>
        <i class="fas fa-images fa-fw" aria-hidden />
      </span>
    </b-col>

    <b-modal
      id="screenshots"
      size="xl"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="game.name"
          @close="close"
        />
      </template>

      <b-carousel
        ref="screenshots"
        v-model="activeImage"
        controls
        indicators
        fade
      >
        <b-carousel-slide
          v-for="(screenshot, index) in slides"
          :key="index"
          content-tag="rounded"
        >
          <template #img>
            <b-img
              rounded
              class="w-100"
              :src="screenshot"
            />
          </template>
        </b-carousel-slide>
      </b-carousel>

      <!-- <div class="d-flex overflow-auto mt-2">
        <b-img
          v-for="(screenshot, index) in slides"
          :key="index"
          :src="screenshot"
          rounded
          width="100"
          :class="['border mr-2', { 'border-primary': activeImage === index }]"
          @click="setSlide(index)"
        />
      </div> -->
    </b-modal>
  </b-form-row>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  data() {
    return {
      activeImage: 0,
      maxThumbnails: 6,
    };
  },

  computed: {
    thumbnails() {
      // eslint-disable-next-line
      return this.trimmedScreenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_thumb/${image_id}.jpg`)
    },

    slides() {
      // eslint-disable-next-line
      return this.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`);
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
    setSlide(index) {
      this.$refs.screenshots.setSlide(index);
    },

    openModal(index = 0) {
      this.activeImage = index;

      this.$bvModal.show('screenshots');
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
