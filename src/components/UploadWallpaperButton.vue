<template lang="html">
  <div>
    <pre>{{ file }}</pre>
    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />

    <b-button
      :disabled="outOfSpace"
      block
      title=""
      :variant="darkTheme ? 'success' : 'primary'"
      @click="triggerFileUpload"
    >
      <b-spinner small v-if="saving" />
      <i v-else class="fa-regular fa-upload" />
    </b-button>

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
    ...mapGetters(['darkTheme']),

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

      console.log(this.file);

      try {
        await this.$store.dispatch('UPLOAD_WALLPAPER', this.file);
      } catch (e) {
        console.log(e);
        this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
      }

      this.file = null;
      this.saving = false;
      this.$bus.$emit('WALLPAPER_UPLOADED');
    },
  },
};
</script>
