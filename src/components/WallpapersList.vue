<template lang="html">
  <div class="wallpapers">
    <preview-wallpaper-modal
      :wallpaper="activeWallpaper"
      :selectable="selectable"
      @selected="selected"
    />

    <b-card
      v-for="wallpaper in wallpapers"
      :key="wallpaper.name"
      :img-src="wallpaper.url"
      :img-alt="wallpaper.name"
      img-left
      img-width="180"
      bg-variant="light"
      class="mb-3 mx-0 p-0 overflow-hidden word-wrap"
    >
      <h6>
        {{ wallpaper.name }}

        <b-badge v-if="wallpaper.metadata && wallpaper.metadata.size">
          {{ formatSize(wallpaper) }}
        </b-badge>
      </h6>

      <b-button
        variant="secondary"
        @click="openModal(wallpaper)"
      >
        Preview
      </b-button>

      <b-button
        variant="danger"
        @click="confirmDeleteWallpaper(wallpaper)"
      >
        <i class="fas fa-trash-alt fa-fw" aria-hidden />
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
    openModal(wallpaper) {
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
