<!-- TODO: allow multiple filters at once -->
<!-- TODO: add rating filtering -->
<template lang="html">
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-tabs>
          <b-tab title="Genres" active>
            <b-button
              v-for="{ id, name } in $options.GAME_GENRES"
              :key="name"
              size="sm"
              :variant="isFilterSelected('genres', id) ? 'primary' : 'link'"
              @click="setFilter('genres', id)"
            >
              {{ name }}
            </b-button>
          </b-tab>

          <b-tab title="Themes">
            <b-button
              v-for="{ id, name } in $options.GAME_THEMES"
              :key="name"
              size="sm"
              :variant="isFilterSelected('themes', id) ? 'primary' : 'link'"
              @click="setFilter('themes', id)"
            >
              {{ name }}
            </b-button>
          </b-tab>

          <b-tab title="Perspective">
            <b-button
              v-for="{ id, name } in $options.GAME_PERSPECTIVES"
              :key="name"
              size="sm"
              :variant="isFilterSelected('player_perspectives', id) ? 'primary' : 'link'"
              @click="setFilter('player_perspectives', id)"
            >
              {{ name }}
            </b-button>
          </b-tab>

          <b-tab title="Platform">
            <b-button
              v-for="{ id, name } in platforms"
              :key="id"
              size="sm"
              class="mb-1 mr-1"
              :variant="isFilterSelected('platforms', id) ? 'primary' : 'link'"
              @click="setFilter('platforms', id)"
            >
              {{ name }}
            </b-button>
          </b-tab>

          <b-tab title="Game modes">
            <b-button
              v-for="{ id, name } in $options.GAME_MODES"
              :key="id"
              size="sm"
              :variant="isFilterSelected('game_modes', id) ? 'primary' : 'link'"
              @click="setFilter('game_modes', id)"
            >
              {{ name }}
            </b-button>
          </b-tab>
        </b-tabs>
      </b-col>

      <b-button
        v-if="hasFilter"
        variant="primary"
        @click="clearFilters"
      >
        Clear filter
      </b-button>

      <!-- <div>
        <b-button
          v-for="{ id, name } in $options.GAME_LANGUAGES"
          :key="name"
          block
          size="sm"
          :variant="isFilterSelected('languages', id) ? 'primary' : ''"
          @click="setFilter('languages', id)"
        >
          {{ name }}
        </b-button>
      </div> -->
    </b-row>
  </b-container>
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
