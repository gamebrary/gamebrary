<template lang="html">
  <div>
    <portal v-if="!isEmpty && user" to="headerActions">
      <b-dropdown
        text="Wallpapers"
        :variant="darkTheme ? 'success' : 'black'"
      >
        <UploadWallpaperButton />
      </b-dropdown>
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
import { mapState, mapGetters } from 'vuex';
import { THUMBNAIL_PREFIX } from '@/constants';
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
    ...mapGetters(['darkTheme']),

    isEmpty() {
      const wallpapers = this.wallpapers?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));

      return !wallpapers || wallpapers?.length === 0;
    },
  },

  mounted() {
    this.loadWallpapers();
  },

  methods: {
    async loadWallpapers() {
      try {
        this.loading = Boolean(this.isEmpty);

        await this.$store.dispatch('LOAD_WALLPAPERS');

        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>
