<template lang="html">
  <!-- TODO: split into their own route -->
  <dashboard-page v-if="user" />
  <public-home-page v-else />
</template>

<script>
// import GameBoards from '@/components/GameBoards';
import DashboardPage from '@/pages/DashboardPage';
import PublicHomePage from '@/pages/PublicHomePage';
import { mapState } from 'vuex';

export default {
  components: {
    // GameBoards,
    DashboardPage,
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
