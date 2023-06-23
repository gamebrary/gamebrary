<template lang="html">
  <b-container>
    <page-title :title="$t('wallpapers.title')">
      <upload-wallpaper-button />
    </page-title>

    <!-- TODO: add artwork/media search and allow to upload using url -->

    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else-if="showEmptyState">
      <empty-state
        message="Upload a wallpaper to customize your boards"
        illustration="wallpapers"
      >
        <upload-wallpaper-button v-if="user" />
        <!-- TODO: add better public page with images/etc -->
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
