<template lang="html">
  <div>
    <preview-wallpaper-modal
      :wallpaper="activeWallpaper"
      :selectable="selectable"
      @selected="selected"
    />

    <div class="wallpapers">
      <b-card
        :img-src="wallpaper.url"
        img-alt="Image"
        img-top
        overlay
        footer-class="p-2"
        tag="article"
        v-for="wallpaper in wallpapers"
        :key="wallpaper.name"
        @click="openPreview(wallpaper)"
      >
        <b-button
          variant="danger"
          size="sm"
          class="position-absolute delete-button"
          @click.stop="confirmDeleteWallpaper(wallpaper)"
        >
          <i class="fas fa-trash fa-fw" aria-hidden />
        </b-button>

        <template #footer>
          <div class="d-flex align-items-start flex-column justify-content-between">
            <b-button
              @click="openPreview(wallpaper)"
              variant="link"
              class="p-0 mb-3 text-truncate"
              block
            >
              {{ wallpaper.name }}

              <b-badge variant="light" v-if="wallpaper.metadata && wallpaper.metadata.size">
                {{ formatSize(wallpaper) }}
              </b-badge>
            </b-button>

            <b-button
              v-if="selectable"
              variant="outline-primary"
              class="border-0"
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
        </template>
      </b-card>
    </div>
    <!-- <b-card
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

    </b-card> -->
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
  .wallpapers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;

    @media(max-width: 1200px) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media(max-width: 780px) {
      grid-template-columns: 1fr 1fr;
    }

    @media(max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }

  .delete-button {
    top: 1rem;
    right: 1rem;
  }
</style>

