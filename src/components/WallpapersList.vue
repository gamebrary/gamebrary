<template lang="html">
  <section>
    <b-container class="pr-0">
      <preview-wallpaper-modal :wallpaper="activeWallpaper" />

      <b-row no-gutters>
        <b-col
          v-for="wallpaper in sortedWallpapers"
          cols="6"
          sm=".fullPath.includes('_300x3006"
          md="3"
          lg="2"
          class="pb-3 pr-3"
          :key="wallpaper.name"
        >
          <div
            :style="`background-image: url(${wallpaper.url})`"
            class="wallpaper-card rounded w-100"
            @click="handleClick(wallpaper)"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { THUMBNAIL_PREFIX } from '@/constants';
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
      // TODO: sort by recent first
      const wallpapers = this.wallpapers.filter((wallpaper) => !wallpaper.fullPath.includes(THUMBNAIL_PREFIX));

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
.wallpaper-card {
  height: 140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
