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
          v-for="{ id, name } in $options.GAME_GENRES"
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
          v-for="{ id, name } in $options.GAME_THEMES"
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
          v-for="{ id, name } in $options.GAME_PERSPECTIVES"
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
          v-for="{ id, name } in $options.GAME_MODES"
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

<script>
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';
import { GAME_GENRES, GAME_PERSPECTIVES, GAME_MODES, GAME_THEMES, GAME_LANGUAGES } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import orderby from 'lodash.orderby';

export default {
  GAME_GENRES,
  GAME_PERSPECTIVES,
  GAME_MODES,
  GAME_THEMES,
  GAME_LANGUAGES,

  components: {
    AppSidebar,
    SidebarHeader,
  },

  data() {
    return {
      visible: false,
    };
  },

  computed: {
    ...mapState(['platforms']),
    ...mapGetters(['darkTheme', 'sidebarRightProps']),

    sortedPlatforms() {
      return orderby(this.platforms, [platform => platform.name]);
    },

    filterType() {
      return this.$route.query?.filterBy;
    },

    filterValue() {
      return this.$route.query?.value;
    },

    filterSelected() {
      return Boolean(this.filterType && this.filterValue);
    },
  },

  mounted() {
    // Listen for sidebar toggle events
    this.$root.$on('bv::toggle::collapse', (id) => {
      if (id === 'filtersSidebar') {
        this.visible = !this.visible;
      }
    });
  },

  beforeUnmount() {
    this.$root.$off('bv::toggle::collapse');
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    hideSidebar() {
      this.visible = false;
    },

    clearFilters() {
      this.$router.push({ name: 'search', query: this.$route.query?.q
          ? { q: this.$route.query?.q }
          : {}
      });
    },

    setFilter(type, value) {
      const query = {
        ...this.$route.query,
        filterBy: type,
        value,
      }

      this.$router.push({ name: 'search', query });
    },

    selectGenre(id) {
      const query = {
        ...this.$route.query,
        genres: id,
      }

      this.$router.push({ name: 'search', query });
    },

    selectPlatform(id) {
      const query = {
        ...this.$route.query,
        platforms: id,
      }

      this.$router.push({ name: 'search', query });
    },
  },
};
</script>
