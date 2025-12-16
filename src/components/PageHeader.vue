<template lang="html">
  <nav :class="[navClass, darkTheme ? 'bg-dark' : 'bg-light']" class="px-3 d-flex align-items-center position-fixed"
    style="height: 56px;">

    <h1>
      <portal-target name="pageTitle" />
    </h1>

    <div>
      <portal-target name="headerActions" />
    </div>

    <div class="d-flex align-items-center gap-2">
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
  const navPos = 'nav-top nav-bottom-mobile';
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

    @media (max-width: calc($bp-md - 1px)) {
      top: auto;
    }
  }

  &.nav-bottom-mobile {
    @media (max-width: calc($bp-md - 1px)) {
      bottom: 60px; // Position above GlobalNav mobile nav (60px height)
      top: auto;
      z-index: 1001; // Ensure it's above GlobalNav (z-index 1000)
    }
  }

  &.nav-bottom {
    bottom: 0;
  }
}
</style>
