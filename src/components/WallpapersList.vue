<template lang="html">
  <b-list-group>
    <b-list-group-item
      v-for="wallpaper in sortedWallpapers"
      :variant="darkTheme ? 'dark' : 'light'"
      :key="wallpaper.name"
      button
      @click="handleClick(wallpaper)"
    >
      <div class="d-flex w-100 p-2 align-items-center">
        <b-img
          :src="wallpaper.url"
          rounded
          width="200"
        />

        <p class="ml-3">
          {{ wallpaper.name }}
        </p>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import sortby from 'lodash.sortby';
import { THUMBNAIL_PREFIX } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
  },

  props: {
    selectable: Boolean,
    selected: String,
    saving: Boolean,
  },

  computed: {
    ...mapState(['wallpapers']),
    ...mapGetters(['darkTheme']),


    sortedWallpapers() {
      const wallpapers = this.wallpapers?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));

      return sortby(wallpapers, 'updated').reverse();
    },

    isEmpty() {
      return this.sortedWallpapers?.length === 0;
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
      this.$store.commit('SET_ACTIVE_WALLPAPER', wallpaper);
    },
  },
};
</script>
