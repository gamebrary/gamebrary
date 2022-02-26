<template lang="html">
  <div>
    <pre>{{ platform }}</pre>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['platforms']),

    platform() {
      return this.platforms.find(({ slug }) => slug === this.$route.params.slug);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
