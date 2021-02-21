<template lang="html">
  <b-form-checkbox
    v-model="darkTheme"
    switch
    @input="toggleTheme"
  >
    Dark theme
  </b-form-checkbox>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      darkTheme: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    this.darkTheme = this.settings && this.settings.theme && this.settings.theme === 'dark';
  },

  methods: {
    toggleTheme() {
      const value = this.darkTheme ? 'dark' : 'light';

      this.$store.commit('UPDATE_SETTING', { key: 'theme', value });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
        });
    },
  },
};
</script>
