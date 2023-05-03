<!-- TODO: allow multiple filters at once -->
<!-- TODO: add rating filtering -->
<template lang="html">
  <b-modal
    id="filters"
    size="md"
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Search filters"
        @close="close"
      >
        <b-button
          v-if="hasFilter"
          @click="clearFilters"
        >
          Clear filter
        </b-button>
      </modal-header>
    </template>

    <b-tabs
      :active-nav-item-class="darkTheme ? 'bg-light' : 'bg-primary'"
      pills
      nav-wrapper-class="pb-3"
    >
      <b-tab title="Genres" active>
        <b-button
          v-for="{ id, name } in $options.GAME_GENRES"
          :key="name"
          size="sm"
          class="mb-1 mr-1"
          :variant="isFilterSelected('genres', id) ? 'primary' : 'light'"
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
          class="mb-1 mr-1"
          :variant="isFilterSelected('themes', id) ? 'primary' : 'light'"
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
          class="mb-1 mr-1"
          :variant="isFilterSelected('player_perspectives', id) ? 'primary' : 'light'"
          @click="setFilter('player_perspectives', id)"
        >
          {{ name }}
        </b-button>
      </b-tab>

      <b-tab title="Platform">
        <div style="column-count: 3;">
          <b-button
            v-for="{ id, name, slug } in platforms"
            :key="id"
            size="sm"
            class="w-100"
            :variant="isFilterSelected('platforms', id) ? 'primary' : 'light'"
            @click="setFilter('platforms', id)"
          >
            <b-avatar
              :src="`/logos/platforms/${slug}.svg`"
              :text="slug"
              rounded
              class="mr-2"
            />

            {{ name }}
          </b-button>
        </div>
      </b-tab>

      <b-tab title="Game modes">
        <b-button
          v-for="{ id, name } in $options.GAME_MODES"
          :key="id"
          size="sm"
          class="mb-1 mr-1"
          :variant="isFilterSelected('game_modes', id) ? 'primary' : 'light'"
          @click="setFilter('game_modes', id)"
        >
          {{ name }}
        </b-button>
      </b-tab>
    </b-tabs>

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
  </b-modal>
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
