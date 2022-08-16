<template lang="html">
  <b-modal
    id="previewWallpaper"
    hide-footer
    size="xl"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Wallpaper"
        :subtitle="wallpaper.name"
        @close="close"
      >
        <b-button
          v-if="selectable"
          @click="select"
        >
          Select
        </b-button>

        <b-button
          variant="danger"
          @click.stop="confirmDeleteWallpaper(wallpaper)"
        >
          <i class="fas fa-trash fa-fw" aria-hidden />
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

    confirmDeleteWallpaper(file) {
      this.$bvModal.msgBoxConfirm('Wallpaper will be permanently removed', {
        title: 'Are you sure you want to delete this file?',
        okVariant: 'danger',
        okTitle: 'Yes',
      })
        .then((value) => {
          if (value) {
            this.deleteFile(file);
          }
        });
    },

    async deleteFile(file) {
      await this.$store.dispatch('DELETE_WALLPAPER', file)
        .catch(() => {
          this.$bvToast.toast('There was an error deleting wallpaper', { variant: 'danger' });
        });

      this.$bvModal.hide('previewWallpaper');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
