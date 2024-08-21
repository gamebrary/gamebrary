<template lang="html">
  <div>
    <portal to="pageTitle">
      Wallpapers
    </portal>
    
    <portal v-if="!isEmpty && user" to="headerActions">
      <UploadWallpaperButton />
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <EmptyState
      v-else-if="isEmpty"
      message="Add a personal touch to your boards by uploading a wallpaper!"
      illustration="wallpapers"
    >
      <UploadWallpaperButton v-if="user">
        <span class="ml-2">Upload wallpaper</span>
      </UploadWallpaperButton>
    </EmptyState>

    <WallpapersList v-else />
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
      loading: false,
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),

    isEmpty() {
      return !this.wallpapers || this.wallpapers?.length === 0;
    },
  },

  mounted() {
    this.loadWallpapers();
  },

  methods: {
    async loadWallpapers() {
      this.loading = true;

      await this.$store.dispatch('LOAD_WALLPAPERS');

      this.loading = false;
    },
  },
};
</script>
