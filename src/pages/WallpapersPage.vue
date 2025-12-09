<template lang="html">
  <div class="px-3">
    <portal v-if="!isEmpty && user" to="headerActions">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-success' : 'btn-dark'"
          type="button"
          id="wallpapersDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Wallpapers
        </button>
        <ul class="dropdown-menu" aria-labelledby="wallpapersDropdown">
          <li>
            <UploadWallpaperButton />
          </li>
        </ul>
      </div>
    </portal>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <EmptyState
      v-else-if="isEmpty"
      message="Add a personal touch to your boards by uploading a wallpaper!"
      illustration="wallpapers"
    >
      <UploadWallpaperButton v-if="user">
        <span class="ms-2">Upload wallpaper</span>
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
