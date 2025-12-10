<template lang="html">
  <nav :class="[navClass, darkTheme ? 'bg-dark' : 'bg-light']" class="px-3 d-flex align-items-center position-fixed"
    style="height: 56px;">

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

      <router-link v-if="!user" :to="{ name: 'auth' }" class="btn btn-success">
        Get started <span class="d-none d-sm-inline"> — it's free!</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useGamesStore } from '@/stores/games';
import { useNotesStore } from '@/stores/notes';
import { useTagsStore } from '@/stores/tags';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useUIStore } from '@/stores/ui';
import { useSettingsStore } from '@/stores/settings';
import { useReleasesStore } from '@/stores/releases';
import { useAppGetters } from '@/stores/getters';
import SearchBox from '@/components/SearchBox';

const route = useRoute();
const router = useRouter();

// Pinia stores
const userStore = useUserStore();
const gamesStore = useGamesStore();
const notesStore = useNotesStore();
const tagsStore = useTagsStore();
const wallpapersStore = useWallpapersStore();
const uiStore = useUIStore();
const settingsStore = useSettingsStore();
const releasesStore = useReleasesStore();
const { darkTheme } = useAppGetters();

// Store state and getters
const user = computed(() => userStore.user);
const games = computed(() => gamesStore.games);
const notes = computed(() => notesStore.notes);
const tags = computed(() => tagsStore.tags);
const wallpapers = computed(() => wallpapersStore.wallpapers);
const menuOpen = computed(() => uiStore.menuOpen);
const routeName = computed(() => uiStore.routeName);
const latestRelease = computed(() => releasesStore.latestRelease);
const transparencyEnabled = computed(() => settingsStore.transparencyEnabled);

// Computed properties
const navClass = computed(() => {
  const navPos = 'nav-top';
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

  @media (min-width: $bp-md) {
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
