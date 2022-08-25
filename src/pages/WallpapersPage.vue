<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'settings' }"
          variant="light"
          class="mr-2"
          >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Wallpapers
      </div>
    </portal>

    <empty-state
      v-if="showEmptyState"
      :title="$t('wallpapers.title')"
      message="Upload a wallpaper to customize your boards"
      @action="triggerFileUpload"
    >
      <b-button
        :disabled="outOfSpace"
        variant="light"
        class="mr-2"
        @click="triggerFileUpload"
      >
        <b-spinner small v-if="saving" />

        <template v-else>
          Upload wallpaper
        </template>
      </b-button>
    </empty-state>

    <template v-else>
      <portal to="headerActions">
        <b-button
          :disabled="outOfSpace"
          variant="light"
          class="mr-2"
          @click="triggerFileUpload"
        >
          <b-spinner small v-if="saving" />

          <template v-else>
            <i class="fas fa-upload fa-fw" aria-hidden />
            <span class="d-none d-sm-inline">Upload</span>
          </template>
        </b-button>
      </portal>

      <b-alert
        v-if="isDuplicate && !saving && file && file.name"
        show
        variant="warning"
      >
        {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
      </b-alert>

      <wallpapers-list />

      <b-alert :show="showEmptyState">You don't have any wallpapers.</b-alert>
    </template>

    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';
import { bytesToSize } from '@/utils';
import WallpapersList from '@/components/WallpapersList';

export default {
  components: {
    EmptyState,
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

  methods: {
    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },

    async uploadWallpaper() {
      if (this.isDuplicate) return this.$bvToast.toast('File already exists', { variant: 'warning' });
      if (!this.file) return false;

      this.saving = true;

      try {
        await this.$store.dispatch('UPLOAD_WALLPAPER', this.file);
      } catch (e) {
        this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
      }

      this.file = null;
      this.saving = false;
      this.$bus.$emit('WALLPAPER_UPLOADED');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.space-used {
  width: 120px;
}
</style>
