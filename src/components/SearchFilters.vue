<template lang="html">
  <b-sidebar
    id="filtersSidebar"
    v-bind="sidebarProps"
    right
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        Filter search results
      </SidebarHeader>

      <div class="p-3">
        <b-link
          v-if="filterSelected"
          size="sm"
          :variant="darkTheme ? 'black' : 'white'"
          @click="clearFilters"
        >
          Clear filter
        </b-link>

        <b-button
          block
          v-b-toggle.genres-accordion
          class="mb-3"
          :variant="filterType === 'genres' ? 'primary' : darkTheme ? 'light' : null"
        >
          Genre
        </b-button>

        <b-collapse id="genres-accordion" visible accordion="search-filters" role="tabpanel">
          <b-button
            v-for="{ id, name } in $options.GAME_GENRES"
            :key="name"
            size="sm"
            class="mb-2 mr-2"
            :variant="filterType === 'genres' && filterValue === id ? 'primary' : darkTheme ? 'black' : 'white'"
            @click="setFilter('genres', id)"
            >
            {{ name }}
          </b-button>
        </b-collapse>


        <b-button
          block
          v-b-toggle.themes-accordion
          class="mb-3"
          :variant="filterType === 'themes' ? 'primary' : darkTheme ? 'light' : null"
        >
          Theme
        </b-button>

        <b-collapse id="themes-accordion" accordion="search-filters" role="tabpanel">
          <b-button
            v-for="{ id, name } in $options.GAME_THEMES"
            :key="name"
            size="sm"
            class="mb-1 mr-1"
            :variant="filterType === 'themes' && filterValue === id ? 'primary' : darkTheme ? 'black' : 'white'"
            @click="setFilter('themes', id)"
          >
            {{ name }}
          </b-button>
        </b-collapse>

        <b-button
          block
          class="mb-3"
          v-b-toggle.perspectives-accordion
          :variant="filterType === 'player_perspectives' ? 'primary' : darkTheme ? 'light' : null"
        >
          Game perspective
        </b-button>

        <b-collapse id="perspectives-accordion" accordion="search-filters" role="tabpanel">
          <b-button
            v-for="{ id, name } in $options.GAME_PERSPECTIVES"
            :key="name"
            size="sm"
            class="mb-1 mr-1"
            :variant="filterType === 'player_perspectives' && filterValue === id ? 'primary' : darkTheme ? 'black' : 'white'"
            @click="setFilter('player_perspectives', id)"
          >
            {{ name }}
          </b-button>
        </b-collapse>

        <b-button
          block
          class="mb-3"
          v-b-toggle.platforms-accordion
          :variant="filterType === 'platforms' ? 'primary' : darkTheme ? 'light' : null"
        >
          Platform
        </b-button>

        <b-collapse id="platforms-accordion" accordion="search-filters" role="tabpanel">
          <b-button
            v-for="{ id, name } in sortedPlatforms"
            :key="id"
            size="sm"
            block
            :variant="filterType === 'platforms' && filterValue === id ? 'primary' : darkTheme ? 'black' : 'white'"
            @click="setFilter('platforms', id)"
          >
            {{ name }}
          </b-button>
        </b-collapse>

        <b-button
          block
          v-b-toggle.gamemodes-accordion
          class="mb-3"
          :variant="filterType === 'game_modes' ? 'primary' : darkTheme ? 'light' : null"
        >
          Game modes
        </b-button>

        <b-collapse id="gamemodes-accordion" visible accordion="search-filters" role="tabpanel">
          <b-button
            v-for="{ id, name } in $options.GAME_MODES"
            :key="id"
            size="sm"
            class="mb-1 mr-1"
            :variant="filterType === 'game_modes' && filterValue === id ? 'primary' : darkTheme ? 'black' : 'white'"
            @click="setFilter('game_modes', id)"
          >
            {{ name }}
          </b-button>
        </b-collapse>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import SidebarHeader from '@/components/SidebarHeader';
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
    SidebarHeader,
  },

  computed: {
    ...mapState(['platforms']),
    ...mapGetters(['darkTheme', 'sidebarProps']),

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

  methods: {
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
