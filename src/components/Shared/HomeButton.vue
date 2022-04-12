<template lang="html">
  <b-button
    title="Dashboard"
    class="home-button"
    variant="transparent"
    @click="handleLogoClick"
  >
    <img
      src="/logo.png"
      width="20"
    />
    <!-- TODO: move back button to here when viewing a game that's part of a board -->
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  methods: {
    handleLogoClick() {
      // if (!this.user) {
      //   if (this.$route.name === 'public-boards') {
      //     this.$bvModal.show('authModal');
      //   } else {
      //     this.$router.push({ name: 'public-boards' });
      //   }
      // }
      //
      // if (this.user && this.$route.name !== 'home') {
      // }
      this.$router.push({ name: 'home' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
