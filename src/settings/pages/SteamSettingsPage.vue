<template lang="html">
  <section>
    <b-container>
      <b-form-group label="Steam ID:">
        <b-form-input
          v-model="steamId"
          style="max-width: 200px"
        />
      </b-form-group>

      <b-button @click="save">
        Save
      </b-button>
    </b-container>
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

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          $bus.$emit('ALERT', { type: 'error', message: 'Error saving settings' })
          this.saving = false;
        });
    },
  },
};
</script>
