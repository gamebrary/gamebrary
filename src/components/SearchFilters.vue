<!-- TODO: allow multiple filters at once -->
<!-- TODO: add rating filtering -->
<template lang="html">
  <b-dropdown
    text="Filter"
    :variant="hasFilter ? 'primary' : 'secondary'"
    class="mr-2"
  >
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

    <b-dropdown-group id="dropdown-group-1" header="Perspectives">
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
    <b-dropdown-divider />
    <b-dropdown-item-button>
      Another Non-grouped Item
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import { GAME_GENRES, GAME_PERSPECTIVES, GAME_MODES } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  GAME_GENRES,
  GAME_PERSPECTIVES,
  GAME_MODES,

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
