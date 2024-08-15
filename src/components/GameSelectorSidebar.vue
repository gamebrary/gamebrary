<template lang="html">
  <b-sidebar
    scrollable
    right
    width="380px"
    shadow
    no-header
    backdrop
    body-class="p-3"
    :visible="visible"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
    @hidden="closeSidebar"
  >
    <template #default="{ hide }">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h3>{{ title }}</h3>
        
        <b-button @click="hide">
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

      <div
        class="py-2"
        style="position: sticky; top: -16px; z-index: 1"
      >
        <b-form-input
          v-model="searchText"
          debounce="500"
          class="mb-2"
          placeholder="Search games (e.g. Axiom Verge)"
          type="search"
          @update="search"
        />

        <b-form-checkbox
          v-if="filteredSearchResults.length"
          v-model="preventClose"
          switch
        >
          Select multiple
        </b-form-checkbox>
      </div>

      <div v-if="loading" style="height: 80px" class="mt-5">
        <b-spinner class="spinner-centered" />
      </div>

      <div v-else-if="filteredSearchResults.length > 0">
        <GameCard
          v-for="game in filteredSearchResults"
          :game-id="game.id"
          :key="game.id"
          selectable
          class="mb-3"
          @click="selectGame(game.id)"
        />
      </div>

      <div v-else-if="searchText">
        No results
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import GameCard from '@/components/GameCard';
import { IMAGE_SIZE_COVER_SMALL, IGDB_QUERIES } from '@/constants';

export default {
  getImageUrl,
  IMAGE_SIZE_COVER_SMALL,

  data() {
    return {
      searchText: '',
      loading: false,
      preventClose: false,
      searchResults: [],
      localFilter: [],
    }
  },

  components: {
    GameCard,
  },

  computed: {
    ...mapState(['board', 'gameSelectorData']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    title() {
      return this.gameSelectorData?.title || 'Select a game';
    },

    filter() {
      const filter = this.gameSelectorData?.filter || [];

      return [...filter, ...this.localFilter];
    },

    visible() {
      return Boolean(this.gameSelectorData);
    },

    filteredSearchResults() {
      return this.searchResults.filter(({ id }) => !this.filter?.includes(id));
    },
  },

  methods: {
    selectGame(gameId) {
      if (this.preventClose) {
        this.localFilter.push(gameId);
      }
      const eventName = this.gameSelectorData?.eventName || 'SELECT_GAME';

      // TODO: replace all instances of @select-game
      this.$bus.$emit(eventName, gameId);

      if (!this.preventClose) this.$store.commit('CLEAR_GAME_SELECTOR_DATA');
    },

    async search() {
      this.loading = true;

      const search = this.searchText
      ? `search "${this.searchText}";`
      : '';

      const filter = !this.searchText
      ? 'where rating >= 80;'
      : '';

      this.searchResults = await this.$store.dispatch('IGDB', {
        path: 'games',
        data: `${search} ${IGDB_QUERIES.SEARCH} limit 50; ${filter}`,
        mutation: 'CACHE_GAME_DATA',
      });

      this.loading = false;
    },

    closeSidebar() {
      this.searchText = '';
      this.loading = false;
      this.preventClose = false;
      this.searchResults = [];
      this.localFilter = [];

      this.$store.commit('CLEAR_GAME_SELECTOR_DATA');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-thumbnail {
  width: 80px;
  height: auto;
}
</style>
