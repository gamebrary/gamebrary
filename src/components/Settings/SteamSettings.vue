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

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      saving: false,
      steamId: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.steamId = this.settings?.steamId || '';
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

    async save() {
      const { steamId, settings } = this;

      const payload = {
        ...settings,
        steamId,
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
