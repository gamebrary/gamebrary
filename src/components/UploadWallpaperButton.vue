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

    <b-button
      title=""
      v-bind="buttonProps"
      @click="triggerFileUpload"
    >
      <span v-if="saving">
        <b-spinner small class="mr-2" />
        Uploading
      </span>

      <span v-if="!saving">
        <i class="fa-regular fa-upload mr-2" />
        Upload
      </span>

      <slot />
    </b-button>
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
    ...mapGetters(['darkTheme', 'buttonProps']),

    // spaceUsed() {
    //   return this.wallpapers.reduce((total, { metadata }) => {
    //     const size = metadata?.size || 0;

    //     return total + size;
    //   }, 0);
    // },

    // outOfSpace() {
    //   return this.spaceUsed >= this.maxSpace;
    // },
  },

  methods: {
    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },

    async uploadWallpaper() {
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
