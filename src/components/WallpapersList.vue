<template lang="html">
  <div class="wallpapers">
    <preview-wallpaper-modal
      :wallpaper="activeWallpaper"
      :selectable="selectable"
      @selected="selected"
    />

    <!-- TODO: put actions in dropdown -->
    <!-- TODO: open preview when clicking on image -->
    <!-- TODO: view toggle -->

    <b-card
      v-for="wallpaper in wallpapers"
      :key="wallpaper.name"
      class="mb-3 mx-0 p-0 word-wrap d-flex position-relative d-flex align-items-start"
      body-class="w-100"
    >
      <b-img
        :src="wallpaper.url"
        :alt="wallpaper.name"
        width="180"
        rounded
        class="mr-3 cursor-pointer"
        @click="openPreview(wallpaper)"
      />

      {{ wallpaper.name }}

      <b-badge v-if="wallpaper.metadata && wallpaper.metadata.size">
        {{ formatSize(wallpaper) }}
      </b-badge>

      <b-dropdown class="float-right" right variant="dark">
        <template v-slot:button-content>
          <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
        </template>

        <b-dropdown-item
          @click="openPreview(wallpaper)"
        >
          Preview
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item
          variant="danger"
          @click="confirmDeleteWallpaper(wallpaper)"
        >
          Delete file
        </b-dropdown-item>
      </b-dropdown>


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
