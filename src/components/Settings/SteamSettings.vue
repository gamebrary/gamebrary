<template lang="html">
  <div>
    <div class="mb-3">
      <label for="steamId" class="form-label">Steam ID:</label>
      <input
        id="steamId"
        type="text"
        v-model="steamId"
        class="form-control"
        style="max-width: 200px"
        @change="save"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

// Reactive state
const saving = ref(false);
const steamId = ref(null);

// Store state and getters
const settings = computed(() => settingsStore.settings);

// Methods
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

const save = async () => {
  const payload = {
    ...settings.value,
    steamId: steamId.value,
  };

  try {
    await settingsStore.saveSettings(payload);
  } catch (e) {
    showToast('There was an error saving your settings', 'danger');
    saving.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  steamId.value = settings.value?.steamId || '';
});
</script>
