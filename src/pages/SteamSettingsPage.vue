<template lang="html">
  <section>
    <div class="container">
      <div class="mb-3">
        <label for="steamId" class="form-label">Steam ID:</label>
        <input
          v-model="steamId"
          id="steamId"
          type="text"
          class="form-control"
          style="max-width: 200px"
        />
      </div>

      <button type="button" class="btn btn-primary" @click="save" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>Save</span>
      </button>
    </div>
  </section>
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
    this.steamId = this.settings?.steamId || null;
  },

  methods: {
    async save() {
      const { steamId, settings } = this;

      const payload = {
        ...settings,
        steamId,
      };

      this.saving = true;
      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.saving = false;
        });
      this.saving = false;
    },
  },
};
</script>
