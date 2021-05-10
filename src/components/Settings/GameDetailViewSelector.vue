<template lang="html">
  <b-form-group label="Open games in:">
    <pre>s {{ gameDetailView }}</pre>

    <b-form-select
      v-model="gameDetailView"
      style="max-width: 200px"
      @change="save"
    >
      <b-form-select-option
        v-for="{ name, value } in GAME_DETAIL_VIEWS"
        :key="value"
        :value="value"
      >
        {{ name }}
      </b-form-select-option>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { mapState } from 'vuex';
import { GAME_DETAIL_VIEWS } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      GAME_DETAIL_VIEWS,
      gameDetailView: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.gameDetailView = settings && settings.gameDetailView
      ? settings.gameDetailView
      : null;
  },

  methods: {
    async save() {
      const { gameDetailView, settings } = this;

      const payload = {
        ...settings,
        gameDetailView,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });

      this.$bvToast.toast('Boom, bitch!');
    },
  },
};
</script>
