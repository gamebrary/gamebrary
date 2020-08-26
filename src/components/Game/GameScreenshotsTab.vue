<template lang="html">
  <b-tab v-if="screenshots">
    <template v-slot:title>
      Screenshots
      <b-badge>{{ screenshots.length }}</b-badge>
    </template>

    <b-img
      v-for="(screenshot, index) in screenshots"
      :key="index"
      :src="screenshot"
      fluid
      blank-color="#ccc"
      fluid-grow
      rounded
      class="mb-3"
    />
  </b-tab>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  data() {
    return {
    };
  },

  computed: {
    screenshots() {
      return this.game && this.game.screenshots
        // eslint-disable-next-line
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${image_id}.jpg`)
        : 'N/A';
    },
  },
};
</script>
