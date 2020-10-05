<template lang="html">
  <b-dropdown-item-button @click="$bvModal.show(`game-modal-${list.name}`)">
    <b-icon-plus class="mr-1" />
    {{ $t('board.addGame.title') }}

    <b-modal
      :id="`game-modal-${list.name}`"
      :title="$t('board.addGame.title')"
      footer-class="p-2 justify-content-center"
      @show="clear"
    >
      <b-form @submit.prevent="search" class="mb-2">
        <b-input-group>
          <b-form-input
            v-model="searchText"
            autofocus
            debounce="500"
            :placeholder="$t('board.addGame.inputPlaceholder')"
          />

          <b-input-group-append>
            <b-button variant="primary" @click="search">
              <b-spinner v-if="loading" small />
              <b-icon-search v-else />
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-form-text v-if="gamesInList.length">
          <strong>{{ gamesInList.length }}</strong>
          {{ $t('board.addGame.alreadyInList') }}
        </b-form-text>
      </b-form>

      <b-card
        v-if="filteredResults.length > 0"
        ref="searchResults"
        body-class="p-1 pb-0 search-results"
        bg-variant="light"
      >
        <game-card-search
          v-for="{ id } in filteredResults"
          :key="id"
          :game-id="id"
          :list="list"
        />
      </b-card>

      <b-alert :show="noResults" variant="warning" class="mt-2 mb-0">
        {{ $t('board.addGame.noResults') }}
      </b-alert>

      <template v-slot:modal-footer>
        <igdb-logo />
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import IgdbLogo from '@/components/IgdbLogo';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardSearch,
    IgdbLogo,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      searchText: '',
      loading: false,
    };
  },

  computed: {
    ...mapState(['results']),

    noResults() {
      return !this.loading
        && this.filteredResults.length === 0
        && this.searchText.trim().length > 0;
    },

    filteredResults() {
      return this.results
        ? this.results.filter(({ id }) => !this.list.games.includes(id))
        : [];
    },

    gamesInList() {
      return this.results
        ? this.results.filter(({ id }) => this.list.games.includes(id))
        : [];
    },
  },

  watch: {
    searchText(value) {
      if (value) {
        this.loading = true;
        this.search();
      }
    },
  },

  methods: {
    clear() {
      this.searchText = '';
      this.$store.commit('CLEAR_SEARCH_RESULTS');
    },

    async search() {
      await this.$store.dispatch('SEARCH_GAMES', this.searchText)
        .catch(() => {
          // TODO toast error
          this.loading = false;
        });

      this.error = null;
      this.loading = false;

      if (this.$refs.searchResults) {
        this.$refs.searchResults.scrollTop = 0;
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-results {
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    display: grid;

    @media(max-width: 780px) {
      max-height: calc(100vh - 200px);
    }
  }
</style>
