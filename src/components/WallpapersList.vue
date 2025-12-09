<template lang="html">
  <ul class="list-group">
    <li
      v-for="(wallpaper, index) in sortedWallpapers"
      class="list-group-item list-group-item-action"
      :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
      :key="index"
      @click="handleClick(wallpaper)"
      style="cursor: pointer;"
    >
      <div class="d-flex w-100 p-2 align-items-center">
        <img
          :src="wallpaper.url"
          class="rounded"
          style="width: 200px; height: auto; object-fit: cover;"
          :alt="wallpaper.name"
        />

        <p class="ms-3 text-truncate mb-0">
          {{ wallpaper.name }}
        </p>
      </div>
    </li>
  </ul>
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
        const modalElement = document.getElementById('boardWallpaper');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }
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
