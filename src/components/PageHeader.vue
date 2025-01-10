<template lang="html">
  <nav :class="navClass" class="px-3 d-flex align-items-center position-fixed" style="height: 56px">
    <b-button
      variant="link"
      class="p-0 mx-1"
      @click="handleLogoClick"
    >
    <!-- src="/logo-new.jpg" -->
      <img
        :src="darkTheme ? '/img/gamebrary-logo-light.png' : '/img/gamebrary-logo-dark.png'"
        class="logo"
        alt="Gamebrary"
      />
    </b-button>

    <div class="d-flex justify-content-between w-100 align-items-center">
      <portal-target name="pageTitle" tag="h1" />
      <portal-target name="headerActions" multiple />

      <b-button
        v-if="!user"
        variant="success"
        :to="{ name: 'auth' }"
      >
        Get started <span class="d-none d-sm-inline"> — it's free!</span>
      </b-button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
  },

  computed: {
    ...mapState(['user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen', 'routeName']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),

    navClass() {
      const navPosition = `nav-${this.navPosition}`;
      const defaultClass = this.darkTheme ? 'bg-dark' : 'bg-light'

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
