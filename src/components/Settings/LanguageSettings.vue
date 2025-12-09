<template lang="html">
  <div class="mb-3">
    <label for="language" class="form-label">Language</label>
    <select
      id="language"
      v-model="language"
      class="form-select"
      style="max-width: 200px"
      @change="saveLanguage"
    >
      <option
        v-for="{ name, value } in SUPPORTED_LANGUAGES"
        :key="value"
        :value="value"
      >
        {{ name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LANGUAGES } from '@/constants';

const store = useStore();
const { locale } = useI18n();

// Reactive state
const saving = ref(false);
const language = ref(null);

// Store state and getters
const settings = computed(() => store.state.settings);

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

const saveLanguage = async () => {
  locale.value = language.value;

  const payload = {
    ...settings.value,
    language: language.value,
  };

  try {
    await store.dispatch('SAVE_SETTINGS', payload);
  } catch (e) {
    showToast('There was an error saving your settings', 'danger');
    saving.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  language.value = settings.value?.language || 'en';
});
</script>
