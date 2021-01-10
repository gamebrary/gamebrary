<template lang="html">
  <b-form-checkbox
    v-model="nightMode"
    name="check-button"
    @input="toggleTheme"
    switch
  >
    Dark theme
  </b-form-checkbox>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      nightMode: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    this.nightMode = Boolean(this.settings && this.settings.nightMode);
  },

  methods: {
    toggleTheme() {
      this.$store.commit('UPDATE_SETTING', { key: 'nightMode', value: this.nightMode });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
        });
    },
  },
};
</script>
