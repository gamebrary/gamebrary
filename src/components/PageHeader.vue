<template lang="html">
  <nav :class="navClass" class="px-3 d-flex align-items-center position-fixed" style="height: 56px">
    <button
      type="button"
      class="btn btn-link p-0 mx-1"
      @click="handleLogoClick"
    >
      <img
        src="/img/gamebrary-logo.png"
        class="logo"
        alt="Gamebrary"
      />
    </button>

    <div class="d-flex justify-content-between w-100 align-items-center">
      <Teleport to="body">
        <div id="pageTitle-portal"></div>
      </Teleport>
      <Teleport to="body">
        <div id="headerActions-portal"></div>
      </Teleport>
      <h1 ref="pageTitleRef"></h1>
      <div ref="headerActionsRef"></div>

      <router-link
        v-if="!user"
        :to="{ name: 'auth' }"
        class="btn btn-success"
      >
        Get started <span class="d-none d-sm-inline"> — it's free!</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen', 'routeName']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),

    navClass() {
      const navPosition = `nav-${this.navPosition}`;
      const isGameRoute = this.$route.name === 'game';

      const defaultClass = !isGameRoute ? '' : this.darkTheme ? 'bg-dark' : 'bg-light'

      const backgroundClasses = this.transparencyEnabled
        ? `semi-transparent ${defaultClass}`
        : defaultClass

      return [navPosition, backgroundClasses]
    },
  },

  methods: {
    handleLogoClick() {
      if (this.user) return this.$store.commit('SET_MENU_OPEN', true);

      this.$router.push({ name: 'home' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 100%;
  z-index: 2;

  &.nav-top {
    top: 0;
    position: fixed;
  }

  &.nav-bottom {
    bottom: 0;
  }
}

.logo {
  width: 200px;

  @media(max-width: 480px) {
    // height: 16px;
    width: 160px;
  }
}
</style>
