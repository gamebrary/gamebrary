<template lang="html">
  <b-form-row v-if="screenshots" class="mt-2">
    <b-col
      v-for="(thumbnail, index) in thumbnails"
      :key="index"
      cols="4"
    >
      <b-img
        :src="thumbnail"
        width="70"
        class="mr-2 mb-2 screenshot"
        rounded
        @click="openModal(index)"
      />
    </b-col>

    <b-col
      v-if="screenshots.length > maxThumbnails"
      cols="4"
      @click="openModal(maxThumbnails)"
    >
      <b-button class="d-block w-100 px-0">
        <i class="fas fa-images fa-fw" aria-hidden></i>
      </b-button>
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
              class="d-block w-100"
              :src="screenshot"
            />
          </template>
        </b-carousel-slide>
      </b-carousel>

      <div class="d-flex overflow-auto mt-2">
        <b-img
          v-for="(screenshot, index) in slides"
          :key="index"
          :src="screenshot"
          rounded
          width="100"
          :class="['border mr-2', { 'border-primary': activeImage === index }]"
          @click="setSlide(index)"
        />
      </div>
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
      maxThumbnails: 5,
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
.screenshot {
  width: 100%;
  height: auto;
}
</style>
