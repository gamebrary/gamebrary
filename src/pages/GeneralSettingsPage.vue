<template lang="html">
  <div>
    <game-detail-settings />
    <dock-settings />
    <language-settings />
  </div>
</template>

<script>
import DockSettings from '@/components/Settings/DockSettings';
import LanguageSettings from '@/components/Settings/LanguageSettings';
import GameDetailSettings from '@/components/Settings/GameDetailSettings';

export default {
  components: {
    DockSettings,
    GameDetailSettings,
    LanguageSettings,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
