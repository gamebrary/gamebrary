<template lang="html">
  <nav :class="navClass">
    <b-button
      variant="link"
      class="p-0 mx-1"
      @click="handleLogoClick"
    >
    <!-- src="/logo-new.jpg" -->
      <img
        src="/logo.png"
        alt=""
        height="38"
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
  display: flex;
  gap: .5rem;
  align-items: center;
  padding-right: 1rem;
  padding: .5rem 20px;
  width: 100dvw;
  position: fixed;
  z-index: 2;

  &.nav-top {
    top: 0;
    position: fixed;
  }

  &.nav-bottom {
    bottom: 0;
  }
}
</style>
