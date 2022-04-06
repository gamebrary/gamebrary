<template lang="html">
  <b-container fluid>
    Note
    {{ $route.name }}
    <pre>{{ name }}</pre>
  </b-container>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$route.params;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
