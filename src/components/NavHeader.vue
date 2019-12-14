<template lang="html">
  <nav>
    <router-link
      :to="{ name: logoRoute }"
      tag="button"
      class="logo"
    >
      <img src="/static/gamebrary-logo.png" >

      <span>{{ title }}</span>
    </router-link>

    <settings v-if="user" />
  </nav>
</template>

<script>
import Settings from '@/pages/Settings';
import { mapState } from 'vuex';

export default {
  components: {
    Settings,
  },

  computed: {
    ...mapState(['user', 'platform', 'settings']),

    isLoggedIn() {
      return this.user && this.user.email;
    },

    title() {
      return this.$route.name === 'game-board' && this.platform
        ? this.platform.name
        : 'Gamebrary';
    },

    logoRoute() {
      if (this.$route.name === 'game-detail' && this.platform) {
        return 'game-board';
      }

      if (this.$route.name === 'settings' && this.platform) {
        return 'game-board';
      }

      if (this.$route.name === 'game-board') {
        return 'platforms';
      }

      return null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";
  nav {
    user-select: none;
    width: 100vw;
    height: $navHeight;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $gp;
    color: var(--header-text-color);

    .logo {
      height: $navHeight;
      font-weight: bold;
      display: flex;
      align-items: center;
      margin-left: -$gp;
      text-transform: capitalize;

      > span {
        text-shadow: -1px -1px 0 var(--body-background),
          1px -1px 0 var(--body-background),
          -1px 1px 0 var(--body-background),
          1px 1px 0 var(--body-background);
      }

      img {
        height: 24px;
        margin-right: $gp / 4;
      }
    }
  }
</style>
