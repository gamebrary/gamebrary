<template lang="html">
  <div>
    <!-- TODO: use PEGI/ESRB logos -->
    <b-form-group label="Game rating system:">
      <b-form-select
        v-model="gameRatingSystem"
        style="max-width: 200px"
        @change="save"
      >
        <b-form-select-option
          v-for="{ name, value } in AGE_RATING_SYSTEMS"
          :key="value"
          :value="value"
        >
          {{ name }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { AGE_RATING_SYSTEMS } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      AGE_RATING_SYSTEMS,
      gameRatingSystem: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.gameRatingSystem = settings && settings.gameRatingSystem
      ? settings.gameRatingSystem
      : null;
  },

  methods: {
    async save() {
      const { gameRatingSystem, settings } = this;

      const payload = {
        ...settings,
        gameRatingSystem,
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
