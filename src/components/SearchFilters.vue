<!-- TODO: allow multiple filters at once -->
<!-- TODO: add rating filtering -->
<template lang="html">
  <b-dropdown
    :variant="hasFilter ? 'primary' : 'secondary'"
    no-caret
    class="mr-2"
  >
    <template #button-content>
      <span class="d-none d-sm-block">Filter</span>
      <i class="fa-solid fa-filter d-sm-none" aria-hidden="true"></i>
    </template>

    <template v-if="hasFilter">
      <b-dropdown-item-button
        variant="primary"
        @click="clearFilters"
      >
        Clear filter
      </b-dropdown-item-button>

      <b-dropdown-divider />
    </template>

    <b-dropdown-group id="genres" header="Genres">
      <b-dropdown-item-button
        v-for="{ id, name } in $options.GAME_GENRES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('genres', id) ? 'primary' : ''"
        @click="setFilter('genres', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group>

    <b-dropdown-group id="themes" header="Themes">
      <b-dropdown-item-button
        v-for="{ id, name } in $options.GAME_THEMES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('themes', id) ? 'primary' : ''"
        @click="setFilter('themes', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group>

    <b-dropdown-group header="Perspectives">
      <b-dropdown-item-button
        v-for="{ id, name } in $options.GAME_PERSPECTIVES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('player_perspectives', id) ? 'primary' : ''"
        @click="setFilter('player_perspectives', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group>

    <!-- <b-dropdown-group header="Languages">
      <b-dropdown-item-button
        v-for="{ id, name } in $options.GAME_LANGUAGES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('languages', id) ? 'primary' : ''"
        @click="setFilter('languages', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group> -->

    <b-dropdown-divider />

    <b-dropdown-group id="dropdown-group-2" header="Platforms">
      <b-dropdown-item-button
        v-for="{ id, name } in platforms"
        :key="id"
        size="sm"
        :variant="isFilterSelected('platforms', id) ? 'primary' : ''"
        @click="setFilter('platforms', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group>
    <b-dropdown-divider />
    <b-dropdown-group id="dropdown-group-2" header="Game modes">
      <b-dropdown-item-button
        v-for="{ id, name } in $options.GAME_MODES"
        :key="id"
        size="sm"
        :variant="isFilterSelected('game_modes', id) ? 'primary' : ''"
        @click="setFilter('game_modes', id)"
      >
        {{ name }}
      </b-dropdown-item-button>
    </b-dropdown-group>
  </b-dropdown>
</template>

<script>
import { GAME_GENRES, GAME_PERSPECTIVES, GAME_MODES, GAME_THEMES, GAME_LANGUAGES } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  GAME_GENRES,
  GAME_PERSPECTIVES,
  GAME_MODES,
  GAME_THEMES,
  GAME_LANGUAGES,

  computed: {
    ...mapState(['platforms']),
    ...mapGetters(['darkTheme']),

    filterBy() {
      return this.$route.query?.filterBy;
    },

    value() {
      return this.$route.query?.value;
    },

    hasFilter() {
      return Object.keys(this.$route.query)?.length > 0;
    },
  },

  methods: {
    clearFilters() {
      this.$router.push({ name: 'search', query: {} });
    },

    isFilterSelected(filterBy, value) {
      const filterSelected = this.filterBy == filterBy;
      const valueSelected = this.value == value;

      return filterSelected && valueSelected;
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
