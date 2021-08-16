<template lang="html">
  <div>
    <b-button
      variant="dark"
      :to="{ name: 'auth' }"
    >
      Sign in
    </b-button>

    <b-button
      variant="info"
      :to="{ name: 'explore' }"
    >
      Explore
    </b-button>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
