<template lang="html">
  <b-navbar class="px-3 py-0">
    <b-navbar-brand href="/">
      <img src="/static/gamebrary-logo.png" height="30" />
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#">
        <settings v-if="user" />
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import Settings from '@/pages/Settings';
import { mapState } from 'vuex';

export default {
  components: {
    Settings,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
