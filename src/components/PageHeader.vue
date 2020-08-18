<template lang="html">
  <b-navbar class="px-3 py-2">
    <b-navbar-brand href="/">
      <img src="/static/gamebrary-logo.png" height="30" />
    </b-navbar-brand>

    <legacy-settings v-if="isLegacyBoard" />
    <settings v-else />
  </b-navbar>
</template>

<script>
import Settings from '@/components/Settings';
import LegacySettings from '@/components/LegacyBoard/LegacySettings';

export default {
  components: {
    Settings,
    LegacySettings,
  },

  computed: {

    isLegacyBoard() {
      return this.$route.name === 'legacy-board';
    },
  },
};
</script>
