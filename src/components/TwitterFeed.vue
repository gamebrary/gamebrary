<template lang="html">
  <div class="twitter-feed">
    <a class="twitter-timeline" href="https://twitter.com/Wario64?ref_src=twsrc%5Etfw" />
  </div>
</template>

<script>
export default {
  props: {
    twitterUser: {
      type: String,
      required: true,
    },
  },

  mounted() {
    // TODO: check if script has been loaded prior to appending
    const plugin = document.createElement('script');
    plugin.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    plugin.async = true;
    document.head.appendChild(plugin);
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.twitter-feed {
  max-height: 100vh;
  overflow: auto;
}
</style>
