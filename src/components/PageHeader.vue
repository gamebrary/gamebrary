<template lang="html">
  <nav :class="navClass" class="px-3 d-flex align-items-center position-fixed" style="height: 56px">

    <Teleport to="body">
      <div id="pageTitle-portal"></div>
    </Teleport>
    <Teleport to="body">
      <div id="headerActions-portal"></div>
    </Teleport>
    <h1 ref="pageTitleRef"></h1>
    <div ref="headerActionsRef"></div>

    <div class="d-flex align-items-center gap-2">
      <SearchBox v-if="user" class="d-none d-md-block" />

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
import SearchBox from '@/components/SearchBox';

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

// Methods - Logo click removed since nav is always visible
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 100%;
  z-index: 999;
  left: 0;
  right: 0;

  @media (min-width: 768px) {
    left: 240px; // Account for left sidebar
  }

  &.nav-top {
    top: 0;
    position: fixed;
  }

  &.nav-bottom {
    bottom: 0;
  }
}
</style>
