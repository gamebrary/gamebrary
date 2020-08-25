<template lang="html">
  <b-navbar class="px-3 py-2" :fixed="fixed">
    <b-navbar-brand :to="{ name: 'home' }">
      <img src="/static/gamebrary-logo.png" height="30" />

      <small v-if="showBoardTitle">{{ board.name }}</small>
    </b-navbar-brand>

    <legacy-settings v-if="isLegacyBoard" />
    <settings v-else />
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex';
import Settings from '@/components/Settings';
import LegacySettings from '@/components/LegacyBoard/LegacySettings';

export default {
  components: {
    Settings,
    LegacySettings,
  },

  computed: {
    ...mapState(['board']),

    fixed() {
      return this.$route.name === 'board'
        ? 'top'
        : '';
    },

    isLegacyBoard() {
      return this.$route.name === 'legacy-board';
    },

    showBoardTitle() {
      return this.$route.name === 'board' && this.board.name;
    },
  },
};
</script>
