<template lang="html">
  <dashboard-page v-if="user" />
  <public-home-page v-else />
</template>

<script>
import Boards from '@/components/Boards';
import DashboardPage from '@/pages/DashboardPage';
import PublicHomePage from '@/pages/PublicHomePage';
import { mapState } from 'vuex';

export default {
  components: {
    Boards,
    DashboardPage,
    PublicHomePage,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
