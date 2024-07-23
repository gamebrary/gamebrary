<template lang="html">
  <div>
    <portal to="pageTitle">
      Wallpapers
    </portal>
    
    <portal to="headerActions">
      <UploadWallpaperButton v-if="user" />
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <empty-state
      v-else-if="showEmptyState"
      message="Add a personal touch to your boards by uploading a wallpaper!"
      illustration="wallpapers"
    >
      <UploadWallpaperButton v-if="user" />
    </empty-state>

    <wallpapers-list v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import WallpapersList from '@/components/WallpapersList';

export default {
  components: {
    EmptyState,
    UploadWallpaperButton,
    WallpapersList,
  },

  data() {
    return {
      file: null,
      saving: false,
      loading: false,
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),

    showEmptyState() {
      return this.wallpapers?.length === 0;
    },
  },

  mounted() {
    this.loadWallpapers();
  },

  methods: {
    async loadWallpapers() {
      try {
        this.loading = true;
        await this.$store.dispatch('LOAD_WALLPAPERS');
      } catch (e) {
        //
      }

      this.loading = false;
    },
  },
};
</script>
