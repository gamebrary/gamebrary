<template lang="html">
  <div>
    <input
      ref="fileInput"
      type="file"
      class="d-none file-input"
      accept="image/*"
      @change="uploadWallpaper"
    />

    <button
      type="button"
      class="btn"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      @click="triggerFileUpload"
      :disabled="saving"
    >
      <span v-if="saving">
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        Uploading
      </span>

      <span v-else>
        <i class="fa-regular fa-upload me-2" />
        Upload
      </span>

      <slot />
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      maxSpace: '67108864',
      saving: false,
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
      this.$refs.fileInput?.click();
    },

    async uploadWallpaper(event) {
      const file = event?.target?.files?.[0];
      if (!file) return false;

      this.saving = true;

      try {
        await this.$store.dispatch('UPLOAD_WALLPAPER', file);
        this.showToast('Wallpaper uploaded successfully', 'success');
      } catch (e) {
        this.showToast('There was an error uploading wallpaper', 'danger');
      }

      // Reset file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      this.saving = false;
      this.$bus.$emit('WALLPAPER_UPLOADED');
    },

    showToast(message, variant = 'info') {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    },
  },
};
</script>
