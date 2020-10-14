<template lang="html">
  <div v-if="screenshots" class="mt-2">
    <b-button @click="openModal(0)" class="d-block d-lg-none" variant="outline-primary">
      <icon name="image" />
      {{ screenshots.length }}
    </b-button>

    <div class="screenshots d-none d-lg-flex">
      <b-img
        v-for="(thumbnail, index) in thumbnails"
        :key="index"
        :src="thumbnail"
        width="70"
        class="mr-2 mb-2"
        rounded
        @click="openModal(index)"
      />
    </div>

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
          v-for="(screenshot, index) in screenshots"
          :key="index"
          :img-src="screenshot"
        />
      </b-carousel>

      <div class="d-flex overflow-auto mt-2">
        <b-img
          v-for="(screenshot, index) in screenshots"
          :key="index"
          :src="screenshot"
          thumbnail
          rounded
          width="100"
          :class="['border mr-2', { 'border-primary': activeImage === index }]"
          @click="setSlide(index)"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  data() {
    return {
      activeImage: 0,
    };
  },

  computed: {
    thumbnails() {
      return this.game && this.game.screenshots
        // eslint-disable-next-line
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_thumb/${image_id}.jpg`)
        : 'N/A';
    },

    screenshots() {
      return this.game && this.game.screenshots
        // eslint-disable-next-line
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${image_id}.jpg`)
        : 'N/A';
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
.screenshots {
  flex-wrap: wrap;
}
</style>
