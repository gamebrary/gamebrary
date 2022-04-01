<template lang="html">
  <b-container fluid>
    <page-title title="Steam settings" />

    <!-- <b-alert show>
      Explain how steam id is used
    </b-alert> -->

    <b-form-group label="Steam ID:">
      <b-form-input
        v-model="steamId"
        style="max-width: 200px"
        @change="save"
      />
    </b-form-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { GAME_DETAIL_VIEWS } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      GAME_DETAIL_VIEWS,
      steamId: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.steamId = settings && settings.steamId
      ? settings.steamId
      : null;
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
