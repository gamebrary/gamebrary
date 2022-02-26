<template lang="html">
  <b-button
    title="Dashboard"
    size="sm"
    class="home-button"
    @click="handleLogoClick"
  >
    <!-- <img
      src="/static/gamebrary-logo-dark.png"
      width="32"
    /> -->
    <i class="fas fa-home" />
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
      if (!this.user) {
        if (this.$route.name === 'public-boards') {
          this.$bvModal.show('authModal');
        } else {
          this.$router.push({ name: 'public-boards' });
        }
      }

      if (this.user && this.$route.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.home-button {
  width: 50px;
}
</style>
