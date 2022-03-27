<template lang="html">
  <div>
    <preview-wallpaper-modal
      :wallpaper="activeWallpaper"
      :selectable="selectable"
      @selected="selected"
    />

    <b-card
      v-for="wallpaper in wallpapers"
      :key="wallpaper.name"
      class="mb-2"
      body-class="wallpaper-card p-2"
    >
      <b-img
        :src="wallpaper.url"
        :alt="wallpaper.name"
        width="180"
        rounded
        class="mr-2 cursor-pointer"
        @click="openPreview(wallpaper)"
      />

      <div class="d-flex align-items-start flex-column">
        <b-button @click="openPreview(wallpaper)" variant="link" class="p-0 mb-3">
          {{ wallpaper.name }}

          <b-badge variant="light" v-if="wallpaper.metadata && wallpaper.metadata.size">
            {{ formatSize(wallpaper) }}
          </b-badge>
        </b-button>

        <b-button
          variant="danger"
          @click="confirmDeleteWallpaper(wallpaper)"
        >
          <i class="fas fa-trash fa-fw" aria-hidden />
        </b-button>

        <b-button
          v-if="selectable"
          variant="primary"
          @click="selected(wallpaper)"
        >
          <i
            v-if="saving"
            class="fas fa-sync fa-spin fa-fw"
            aria-hidden
          />

          <span v-else>Select</span>
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import PreviewWallpaperModal from '@/components/Wallpapers/PreviewWallpaperModal';
import { bytesToSize } from '@/utils';
import { mapState } from 'vuex';

export default {
  components: {
    PreviewWallpaperModal,
  },

  props: {
    selectable: Boolean,
    saving: Boolean,
  },

  data() {
    return {
      activeWallpaper: false,
    };
  },

  computed: {
    ...mapState(['wallpapers']),
  },

  methods: {
    openPreview(wallpaper) {
      this.activeWallpaper = wallpaper;
      this.$bvModal.show('previewWallpaper');
    },

    selected(wallpaper) {
      if (this.selectable) {
        this.$emit('selected', wallpaper);
      }
    },

    formatSize(wallpaper) {
      const size = wallpaper && wallpaper.metadata && wallpaper.metadata.size
        ? wallpaper.metadata.size
        : 0;

      return bytesToSize(size);
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

      this.$bvToast.toast('File deleted');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wallpaper-card {
    display: grid;
    grid-template-columns: 200px auto;
  }
</style>

