<template lang="html">
  <div>
    <b-form-group label="Steam ID:">
      <b-form-input
        v-model="steamId"
        style="max-width: 200px"
        @change="save"
      />
    </b-form-group>
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
    async save() {
      const { steamId, settings } = this;

      const payload = {
        ...settings,
        steamId,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },
  },
};
</script>
