<template lang="html">
  <settings-page v-if="user" />
  <public-home-page v-else />
</template>

<script>
import SettingsPage from '@/pages/SettingsPage';
import PublicHomePage from '@/pages/PublicHomePage';
import { mapState } from 'vuex';

export default {
  components: {
    SettingsPage,
    PublicHomePage,
  },

  computed: {
    ...mapState(['user']),
  },

  mounted() {
    if (this.user) this.$store.dispatch('LOAD_BOARDS');
  },
};
</script>
