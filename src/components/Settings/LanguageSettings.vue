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

<script>
import { mapState } from 'vuex';
import { SUPPORTED_LANGUAGES } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      SUPPORTED_LANGUAGES,
      language: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    this.language = this.settings?.language || 'en';
  },

  methods: {
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

    async saveLanguage() {
      const { language, settings } = this;
      this.$i18n.locale = language;

      const payload = {
        ...settings,
        language,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.showToast('There was an error saving your settings', 'danger');
          this.saving = false;
        });
    },
  },
};
</script>
