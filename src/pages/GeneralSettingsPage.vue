<template lang="html">
  <b-container fluid>
    <page-title title="General settings" />
    <game-detail-settings />
    <!-- <dock-settings /> -->
    <language-settings />
  </b-container>
</template>

<script>
// import DockSettings from '@/components/Settings/DockSettings';
import LanguageSettings from '@/components/Settings/LanguageSettings';
import GameDetailSettings from '@/components/Settings/GameDetailSettings';

export default {
  components: {
    // DockSettings,
    GameDetailSettings,
    LanguageSettings,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
