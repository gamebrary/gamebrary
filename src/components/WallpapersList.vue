<template lang="html">
  <div v-if="isEmpty">
    isEmpty
  </div>
  
  <b-list-group v-else>
    <b-list-group-item
      v-for="wallpaper in sortedWallpapers"
      :variant="darkTheme ? 'dark' : 'light'"
      :key="wallpaper.name"
      button
      @click="handleClick(wallpaper)"
      class="flex-column align-items-start"
    >
      <div class="d-flex w-100 justify-content-between">
        <b-img
          :src="wallpaper.url"
          class="mb-3"
          rounded
          width="200"
        />

        <!-- <small>{{ wallpaper.size }}</small> -->
      </div>

      <p class="mb-1">
        {{ wallpaper.name }}
        {{ wallpaper.timeCreated }}
      </p>
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
