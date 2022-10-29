<!-- TODO: get all refs at first, paginate and render as needed -->
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

        <b-alert :show="showEmptyState">You don't have any wallpapers.</b-alert>
      </template>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import { bytesToSize } from '@/utils';
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
      maxSpace: '67108864', // 64mb storage limit
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),

    usedSpaceText() {
      return `${this.formattedSpaceUsed} of ${bytesToSize(this.maxSpace)} used`;
    },

    existingFiles() {
      return this.wallpapers.map(({ name }) => name);
    },

    showEmptyState() {
      return this.wallpapers?.length === 0;
    },

    isDuplicate() {
      const { file, existingFiles } = this;

      return file && file.name && existingFiles.includes(file.name);
    },

    formattedSpaceUsed() {
      return this.spaceUsed
        ? bytesToSize(this.spaceUsed)
        : 0;
    },

    spaceUsed() {
      return this.wallpapers.reduce((total, { metadata }) => {
        const size = metadata && metadata.size
          ? metadata.size
          : 0;

        return total + size;
      }, 0);
    },

    outOfSpace() {
      return this.spaceUsed >= this.maxSpace;
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

    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },
  },
};
</script>
