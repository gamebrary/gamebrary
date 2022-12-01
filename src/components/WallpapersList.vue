<template lang="html">
  <section>
    <b-container class="pr-0">
      <preview-wallpaper-modal :wallpaper="activeWallpaper" />

      <b-row no-gutters>
        <b-col
          v-for="wallpaper in sortedWallpapers"
          cols="6"
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
import sortby from 'lodash.sortby';
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
      const wallpapers = this.wallpapers?.filter((wallpaper) => !wallpaper?.ref?.includes(THUMBNAIL_PREFIX));

      return sortby(wallpapers, 'updated').reverse();
    },
  },

  methods: {
    handleClick(wallpaper) {
      if (this.selectable && wallpaper?.ref) {
        this.$emit('select', wallpaper.ref);
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
