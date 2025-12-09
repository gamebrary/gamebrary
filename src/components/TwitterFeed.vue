<template lang="html">
  <div class="twitter-feed">
    <a class="twitter-timeline" href="https://twitter.com/Wario64?ref_src=twsrc%5Etfw" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

defineProps({
  twitterUser: {
    type: String,
    required: true,
  },
});

// Lifecycle hooks
onMounted(() => {
  const plugin = document.createElement('script');
  plugin.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  plugin.async = true;
  document.head.appendChild(plugin);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.twitter-feed {
  max-height: 100svh;
  overflow: auto;
}
</style>
