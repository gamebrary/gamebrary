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
        overlay
        footer-class="p-2"
        tag="article"
        v-for="wallpaper in sortedWallpapers"
        :key="wallpaper.name"
        @click="openPreview(wallpaper)"
      >
        <b-button
          @click="openPreview(wallpaper)"
          class="text-truncate text-white"
          variant="transparent"
          block
        >
          {{ wallpaper.name }}
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
      <!-- <b-badge variant="light">
        {{ formatSize(wallpaper) }}
      </b-badge> -->
      </b-card>
    </div>
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

    sortedWallpapers() {
      const wallpapers = this.wallpapers;

      return wallpapers.reverse();
    },
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
      const size = wallpaper?.metadata?.size || 0;

      return bytesToSize(size);
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
</style>

