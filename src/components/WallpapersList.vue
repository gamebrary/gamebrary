<template lang="html">
  <div>
    <preview-wallpaper-modal :wallpaper="activeWallpaper" />

    <div :class="['wallpapers', { selectable }]">
      <b-card
        :img-src="wallpaper.url"
        img-alt="Image"
        overlay
        footer-class="p-2"
        :class="{ 'cursor-pointer': selectable, 'bg-success p-1': wallpaper.fullPath === selected }"
        tag="article"
        v-for="wallpaper in sortedWallpapers"
        :key="wallpaper.name"
        @click="handleClick(wallpaper)"
      />
    </div>
  </div>
</template>

<script>
import PreviewWallpaperModal from '@/components/Wallpapers/PreviewWallpaperModal';
import { mapState } from 'vuex';

export default {
  components: {
    PreviewWallpaperModal,
  },

  props: {
    selectable: Boolean,
    selected: String,
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
    handleClick(wallpaper) {
      if (this.selectable && wallpaper?.fullPath) {
        this.$emit('select', wallpaper.fullPath);
        this.$bvModal.hide('boardWallpaper');
      } else {
        this.openPreview(wallpaper);
      }
    },

    openPreview(wallpaper) {
      this.activeWallpaper = wallpaper;
      this.$bvModal.show('previewWallpaper');
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

    // &.selectable {
    //   grid-template-columns: 1fr 1fr !important;
    // }
  }
</style>

