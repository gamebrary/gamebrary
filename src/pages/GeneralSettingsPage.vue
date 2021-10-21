<template lang="html">
  <div>
    <dock-settings />
    <language-settings />
  </div>
</template>

<script>
import DockSettings from '@/components/Settings/DockSettings';
import LanguageSettings from '@/components/Settings/LanguageSettings';

export default {
  components: {
    DockSettings,
    LanguageSettings,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
