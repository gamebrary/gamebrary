<template lang="html">
  <b-modal
    id="previewWallpaper"
    hide-footer
    size="xl"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="wallpaper.name"
        @close="close"
      />
    </template>

    <b-img
      v-if="wallpaper && wallpaper.url"
      :src="wallpaper.url"
      class="w-100"
    />
  </b-modal>
</template>

<script>
export default {
  props: {
    wallpaper: Object,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
