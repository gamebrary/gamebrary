<template lang="html">
  <nav>
    <router-link
      :to="{ name: logoRoute }"
      tag="button"
      class="logo"
    >
      <img src="/static/gamebrary-logo.png" >

      <span
        v-if="this.settings[this.platform.code].theme != 'app-like'"
      >
        {{ title }}
      </span>
    </router-link>

    <span
      v-if="this.settings[this.platform.code].theme === 'app-like'"
    >
      {{ title }}
    </span>
    <settings v-if="showSettings" />
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

    showSettings() {
      return this.$route.name === 'game-board';
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

    .theme-app-like & {
      bottom: 0;
      position: absolute;
      background: var(--nav-background);

      @supports (backdrop-filter: none) {
        z-index: 1;
        background: transparent;

        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: rgba(var(--nav-background-rgb), .8);
          backdrop-filter: blur(10px);
        }
      }
    }

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
