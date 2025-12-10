<template lang="html">
  <AppSidebar
    id="filtersSidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Filter search results" />
    </template>

    <div class="p-3">
      <a
        v-if="filterSelected"
        href="#"
        class="link-primary small"
        @click.prevent="clearFilters"
      >
        Clear filter
      </a>

      <button
        type="button"
        class="btn w-100 mb-3"
        :class="filterType === 'genres' ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse"
        data-bs-target="#genres-accordion"
        aria-expanded="true"
        aria-controls="genres-accordion"
      >
        Genre
      </button>

      <div class="collapse show" id="genres-accordion" data-bs-parent="#filtersSidebar">
        <button
          v-for="{ id, name } in GAME_GENRES"
          :key="name"
          type="button"
          class="btn btn-sm mb-2 me-2"
          :class="filterType === 'genres' && filterValue === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
          @click="setFilter('genres', id)"
        >
          {{ name }}
        </button>
      </div>

      <button
        type="button"
        class="btn w-100 mb-3"
        :class="filterType === 'themes' ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse"
        data-bs-target="#themes-accordion"
        aria-expanded="false"
        aria-controls="themes-accordion"
      >
        Theme
      </button>

      <div class="collapse" id="themes-accordion" data-bs-parent="#filtersSidebar">
        <button
          v-for="{ id, name } in GAME_THEMES"
          :key="name"
          type="button"
          class="btn btn-sm mb-1 me-1"
          :class="filterType === 'themes' && filterValue === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
          @click="setFilter('themes', id)"
        >
          {{ name }}
        </button>
      </div>

      <button
        type="button"
        class="btn w-100 mb-3"
        :class="filterType === 'player_perspectives' ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse"
        data-bs-target="#perspectives-accordion"
        aria-expanded="false"
        aria-controls="perspectives-accordion"
      >
        Game perspective
      </button>

      <div class="collapse" id="perspectives-accordion" data-bs-parent="#filtersSidebar">
        <button
          v-for="{ id, name } in GAME_PERSPECTIVES"
          :key="name"
          type="button"
          class="btn btn-sm mb-1 me-1"
          :class="filterType === 'player_perspectives' && filterValue === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
          @click="setFilter('player_perspectives', id)"
        >
          {{ name }}
        </button>
      </div>

      <button
        type="button"
        class="btn w-100 mb-3"
        :class="filterType === 'platforms' ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse"
        data-bs-target="#platforms-accordion"
        aria-expanded="false"
        aria-controls="platforms-accordion"
      >
        Platform
      </button>

      <div class="collapse" id="platforms-accordion" data-bs-parent="#filtersSidebar">
        <button
          v-for="{ id, name } in sortedPlatforms"
          :key="id"
          type="button"
          class="btn btn-sm w-100 mb-1"
          :class="filterType === 'platforms' && filterValue === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
          @click="setFilter('platforms', id)"
        >
          {{ name }}
        </button>
      </div>

      <button
        type="button"
        class="btn w-100 mb-3"
        :class="filterType === 'game_modes' ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse"
        data-bs-target="#gamemodes-accordion"
        aria-expanded="true"
        aria-controls="gamemodes-accordion"
      >
        Game modes
      </button>

      <div class="collapse show" id="gamemodes-accordion" data-bs-parent="#filtersSidebar">
        <button
          v-for="{ id, name } in GAME_MODES"
          :key="id"
          type="button"
          class="btn btn-sm mb-1 me-1"
          :class="filterType === 'game_modes' && filterValue === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
          @click="setFilter('game_modes', id)"
        >
          {{ name }}
        </button>
      </div>
    </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useAppGetters } from '@/stores/getters';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import { GAME_GENRES, GAME_PERSPECTIVES, GAME_MODES, GAME_THEMES } from '@/constants';
import orderby from 'lodash.orderby';

const route = useRoute();
const router = useRouter();
const gamesStore = useGamesStore();
const { darkTheme, sidebarRightProps } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const visible = ref(false);

// Store state and getters
const platforms = computed(() => gamesStore.platforms);

// Computed properties
const sortedPlatforms = computed(() => {
  return orderby(platforms.value, [(platform) => platform.name]);
});

const filterType = computed(() => route.query?.filterBy);

const filterValue = computed(() => route.query?.value);

const filterSelected = computed(() => Boolean(filterType.value && filterValue.value));

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
};

const clearFilters = () => {
  router.push({
    name: 'search',
    query: route.query?.q ? { q: route.query.q } : {},
  });
};

const setFilter = (type, value) => {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      filterBy: type,
      value,
    },
  });
};

const selectGenre = (id) => {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      genres: id,
    },
  });
};

const selectPlatform = (id) => {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      platforms: id,
    },
  });
};

// Lifecycle hooks
onMounted(() => {
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'filtersSidebar') {
        visible.value = !visible.value;
      }
    });
  }
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('bv::toggle::collapse');
  }
});
</script>
