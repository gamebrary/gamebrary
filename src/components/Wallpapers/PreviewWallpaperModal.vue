<template lang="html">
  <b-modal
    id="previewWallpaper"
    hide-footer
    size="xl"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Wallpaper preview"
        :subtitle="wallpaper.name"
        @close="close"
      >
        <b-button
          v-if="selectable"
          @click="select"
        >
          Select
        </b-button>
      </modal-header>
    </template>

    <b-img
      v-if="wallpaper && wallpaper.url"
      :src="wallpaper.url"
      class="w-100 rounded"
    />
  </b-modal>
</template>

<script>
export default {
  props: {
    selectable: Boolean,
    wallpaper: {
      type: [Object, Boolean],
      default: () => {},
    },
  },

  methods: {
    select() {
      this.$emit('selected', this.wallpaper);

      this.$bvModal.hide('previewWallpaper');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
