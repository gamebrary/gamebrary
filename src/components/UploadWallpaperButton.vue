<template lang="html">
  <div>
    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />

    <b-dropdown-item
      :disabled="outOfSpace"
      block
      @click="triggerFileUpload"
    >
      <b-spinner small v-if="saving" />

      <template v-else>
        <img
          src="/img/dock-icons/upload-wallpaper.png"
          alt="Wallpapers"
          width="24"
        />

        <span class="ml-2">Upload</span>
      </template>
    </b-dropdown-item>

    <b-alert
      v-if="isDuplicate && !saving && file && file.name"
      show
      variant="warning"
    >
      {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
    </b-alert>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      maxSpace: '67108864',
      saving: false,
      file: null,
    }
  },

  computed: {
    ...mapState(['wallpapers']),
    ...mapGetters(['darkTheme', 'isVerticalNav']),

    isDuplicate() {
      const { file, existingFiles } = this;

      return existingFiles?.includes(file?.name);
    },

    spaceUsed() {
      return this.wallpapers.reduce((total, { metadata }) => {
        const size = metadata?.size || 0;

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
