<template lang="html">
  <section>
    <b-container class="pb-5 px-0">
      <portal to="pageTitle">Wallpapers</portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <empty-state
        v-else-if="showEmptyState"
        :title="$t('wallpapers.title')"
        message="Upload a wallpaper to customize your boards"
      >
        <upload-wallpaper-button />
      </empty-state>

      <template v-else>
        <portal to="headerActions">
          <upload-wallpaper-button />
        </portal>

        <wallpapers-list />
      </template>
    </b-container>
  </section>
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
