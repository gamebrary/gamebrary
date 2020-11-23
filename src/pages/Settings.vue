<template lang="html">
  <b-container class="pt-3">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">Settings</h3>
      </div>


    <b-list-group>
      <b-list-group-item variant="transparent" @click="toggleTheme">
        <icon :name="nightMode ? 'moon' : 'sun'" />
        Toggle dark theme (Beta)
      </b-list-group-item>

      <b-list-group-item variant="transparent" :to="{ name: 'wallpapers' }">
        <icon name="image" />
        Wallpapers
      </b-list-group-item>

      <b-list-group-item variant="transparent" :to="{ name: 'language' }">
        <icon name="globe" />
        Language
      </b-list-group-item>

      <b-list-group-item variant="transparent" :to="{ name: 'about' }">
        <icon name="info" />
        About
      </b-list-group-item>

      <b-list-group-item variant="transparent" :to="{ name: 'releases' }">
        <icon name="megaphone" />
        Releases
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nightMode']),
    ...mapState(['settings']),
  },

  methods: {
    toggleTheme() {
      this.$store.commit('UPDATE_SETTING', { key: 'nightMode', value: !this.nightMode });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
