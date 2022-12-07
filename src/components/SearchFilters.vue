<!-- TODO: allow multiple filters at once -->
<!-- TODO: add rating filtering -->
<template lang="html">
  <div class="search-filters">
    <h4>Filter</h4>
    <b-button
      block
      v-b-toggle.genres
      :variant="filterBy === 'genres' ? 'outline-success' : 'light'"
      class="mb-2"
    >
      Genres
    </b-button>

    <b-collapse
      id="genres"
      :visible="filterBy === 'genres'"
      accordion="filters"
      role="tabpanel"
    >
      <b-button
        v-for="{ id, name } in $options.GAME_GENRES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('genres', id) ? 'outline-success' : 'link'"
        class="text-left my-0"
        @click="setFilter('genres', id)"
      >
        {{ name }}
      </b-button>
    </b-collapse>

    <b-button
      block
      v-b-toggle.player_perspectives
      class="mb-2"
      :variant="filterBy === 'player_perspectives' ? 'outline-success' : 'light'"
    >
      Perspectives
    </b-button>

    <b-collapse
      id="player_perspectives"
      :visible="filterBy === 'player_perspectives'"
      accordion="filters"
      role="tabpanel"
    >
      <b-button
        v-for="{ id, name } in $options.GAME_PERSPECTIVES"
        :key="name"
        block
        size="sm"
        :variant="isFilterSelected('player_perspectives', id) ? 'outline-success' : 'link'"
        class="text-left my-0"
        @click="setFilter('player_perspectives', id)"
      >
        {{ name }}
      </b-button>
    </b-collapse>
    <!-- :variant="genresFilter.includes(id) ? 'success' : 'light'" -->

    <b-button
      block
      v-b-toggle.platforms
      class="mb-2"
      :variant="filterBy === 'platforms' ? 'outline-success' : 'light'"
    >
      Platforms
    </b-button>

    <b-collapse
      id="platforms"
      :visible="filterBy === 'platforms'"
      accordion="filters"
      role="tabpanel"
    >
      <b-button
        v-for="{ id, name } in platforms"
        :key="id"
        block
        size="sm"
        :variant="isFilterSelected('platforms', id) ? 'outline-success' : 'link'"
        class="text-left my-0"
        @click="setFilter('platforms', id)"
      >
        {{ name }}
      </b-button>
    </b-collapse>

    <b-button
      block
      v-b-toggle.game_modes
      class="mb-2"
      :variant="filterBy === 'game_modes' ? 'outline-success' : 'light'"
    >
      Game modes
    </b-button>

    <b-collapse
      id="game_modes"
      :visible="filterBy === 'game_modes'"
      accordion="filters"
      role="tabpanel"
    >
      <b-button
        v-for="{ id, name } in $options.GAME_MODES"
        :key="id"
        block
        size="sm"
        :variant="isFilterSelected('game_modes', id) ? 'outline-success' : 'link'"
        class="text-left my-0"
        @click="setFilter('game_modes', id)"
      >
        {{ name }}
      </b-button>
    </b-collapse>
  </div>
</template>

<script>
import { GAME_GENRES, GAME_PERSPECTIVES, GAME_MODES } from '@/constants';
import { mapState } from 'vuex';

export default {
  GAME_GENRES,
  GAME_PERSPECTIVES,
  GAME_MODES,

  computed: {
    ...mapState(['platforms']),

    filterBy() {
      return this.$route.query?.filterBy;
    },

    value() {
      return this.$route.query?.value;
    }
  },

  methods: {
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

<style lang="scss" rel="stylesheet/scss" scoped>
.search-filters {
  max-height: 80vh;
  overflow: auto;
  position: sticky;
  top: 0;
}
</style>
