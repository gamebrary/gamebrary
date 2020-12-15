<template lang="html">
  <b-container class="pt-3">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">Settings</h3>
      </div>


    <b-list-group>
      <b-list-group-item tag="a" @click="toggleTheme">
        <i :class="`fas fa-${nightMode ? 'sun' : 'moon'}`" aria-hidden></i>
        Toggle dark theme (Beta)
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'wallpapers' }">
        <i class="fas fa-image" aria-hidden></i>
        Wallpapers
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'language' }">
        <i class="fas fa-language" aria-hidden></i>
        Language
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'about' }">
        <i class="fas fa-info" aria-hidden></i>
        About
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'releases' }">
        <i class="fas fa-bullhorn" aria-hidden></i>
        Releases
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'account' }">
        <b-avatar
          v-if="user && user.photoURL"
          v-b-tooltip.hover.right
          size="22px"
          variant="info"
          badge-variant="danger"
          :title="$t('navMenu.account')"
          :src="user.photoURL"
        />

        Account
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nightMode']),
    ...mapState(['settings', 'user']),
  },

  methods: {
    toggleTheme() {
      this.$store.commit('UPDATE_SETTING', { key: 'nightMode', value: !this.nightMode });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
        });
    },
  },
};
</script>
