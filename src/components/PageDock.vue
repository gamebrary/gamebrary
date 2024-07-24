<!-- TODO: get better (and) colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<!-- TODO: put login/logout button at top right corner -->
<template lang="html">
  <nav :class="[`nav-${navPosition}`, darkTheme ? 'bg-dark' : 'bg-light']" >
    <b-button
      variant="link"
      @click="handleLogoClick"
    >
      <img
          src="/logo.png"
          alt=""
          height="26"
        />
    </b-button>

    <div class="d-flex justify-content-between w-100 align-items-center">
      <portal-target name="pageTitle"/>
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
    ...mapState(['user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),
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
  gap: 1rem;
  align-items: center;
  border-radius: .5rem;
  margin: .5rem;
  padding-right: 1rem;
  padding: .25rem;
  width: calc(100dvw - 2rem);
  position: fixed;
  z-index: 2;
  
  &.nav-top {
    top: 0;
    // margin: .5rem;
    position: fixed;
  }

  &.nav-bottom {
    bottom: .5rem;
    // background-color: red;
    // margin: .5rem 1rem;
  }
}
</style>
