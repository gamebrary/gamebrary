<template lang="html">
  <section>
    <b-container class="pb-5 px-0">
      <portal to="pageTitle">
        <h3>{{ $t('wallpapers.title') }}</h3>
      </portal>

      <!-- TODO: add artwork/media search and allow to upload using url -->

      <b-spinner v-if="loading" class="spinner-centered" />

      <template v-else-if="showEmptyState">
        <empty-state
          message="Upload a wallpaper to customize your boards"
        >
          <upload-wallpaper-button v-if="user" />
          <b-button
            v-else
            :to="{ name: 'auth' }"
          >
            Login
          </b-button>
          <!-- TODO: add better public page with images/etc -->
        </empty-state>
      </template>

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
