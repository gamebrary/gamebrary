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

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();

// Store state and getters
const user = computed(() => store.state.user);
const games = computed(() => store.state.games);
const notes = computed(() => store.state.notes);
const tags = computed(() => store.state.tags);
const wallpapers = computed(() => store.state.wallpapers);
const menuOpen = computed(() => store.state.menuOpen);
const routeName = computed(() => store.state.routeName);
const navPosition = computed(() => store.getters.navPosition);
const latestRelease = computed(() => store.getters.latestRelease);
const darkTheme = computed(() => store.getters.darkTheme);
const transparencyEnabled = computed(() => store.getters.transparencyEnabled);

// Computed properties
const navClass = computed(() => {
  const navPos = `nav-${navPosition.value}`;
  const isGameRoute = route.name === 'game';

  const defaultClass = !isGameRoute ? '' : darkTheme.value ? 'bg-dark' : 'bg-light';

  const backgroundClasses = transparencyEnabled.value
    ? `semi-transparent ${defaultClass}`
    : defaultClass;

  return [navPos, backgroundClasses];
});

// Methods
const handleLogoClick = () => {
  if (user.value) {
    store.commit('SET_MENU_OPEN', true);
    return;
  }

  router.push({ name: 'home' });
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
