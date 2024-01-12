<template lang="html">
  <b-container>
    <page-title :title="$t('wallpapers.title')" />
    
    <portal to="headerActions" v-if="!isVerticalNav">
      <upload-wallpaper-button />
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else-if="showEmptyState">
      <empty-state
        message="Add a personal touch to your boards by uploading a wallpaper!"
        illustration="wallpapers"
      >
        <upload-wallpaper-button v-if="user" />
      </empty-state>
    </template>

    <template v-else>
      <wallpapers-list />
    </template>
  </b-container>
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
