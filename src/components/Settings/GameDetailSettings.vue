<template lang="html">
  <div>
    <b-form-group label="Game rating system:">
      <b-form-select
        v-model="gameRatingSystem"
        style="max-width: 200px"
        @change="save"
      >
        <b-form-select-option
          v-for="{ name, value } in GAME_DETAIL_RATING"
          :key="value"
          :value="value"
        >
          {{ name }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>

    <b-form-group label="Open games in:">
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GAME_DETAIL_VIEWS, GAME_DETAIL_RATING } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      GAME_DETAIL_VIEWS,
      GAME_DETAIL_RATING,
      gameDetailView: null,
      gameRatingSystem: null,
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

    this.gameRatingSystem = settings && settings.gameRatingSystem
      ? settings.gameRatingSystem
      : null;
  },

  methods: {
    async save() {
      const { gameDetailView, gameRatingSystem, settings } = this;

      const payload = {
        ...settings,
        gameDetailView,
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
