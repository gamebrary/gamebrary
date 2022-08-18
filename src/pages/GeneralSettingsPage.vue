<template lang="html">
  <b-container>
    <page-title title="General settings" />
    <!-- <game-detail-settings /> -->
    <language-settings />
  </b-container>
</template>

<script>
import LanguageSettings from '@/components/Settings/LanguageSettings';
// import GameDetailSettings from '@/components/Settings/GameDetailSettings';

export default {
  components: {
    // GameDetailSettings,
    LanguageSettings,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
