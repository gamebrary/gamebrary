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

<script setup>
import { ref, computed, inject } from 'vue';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters } from '@/stores/getters';

const wallpapersStore = useWallpapersStore();
const { darkTheme, buttonProps } = useAppGetters();
const $bus = inject('$bus');

// Template refs
const fileInput = ref(null);

// Reactive state
const maxSpace = ref('67108864');
const saving = ref(false);

// Store state and getters
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click();
};

const uploadWallpaper = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return false;

  saving.value = true;

  try {
    const { useUserStore } = await import('@/stores/user');
    const userStore = useUserStore();
    await wallpapersStore.uploadWallpaper(userStore.user.uid, file);
    showToast('Wallpaper uploaded successfully', 'success');
  } catch (e) {
    showToast('There was an error uploading wallpaper', 'danger');
  } finally {
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    saving.value = false;
    $bus.$emit('WALLPAPER_UPLOADED');
  }
};

const showToast = (message, variant = 'info') => {
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
};
</script>
