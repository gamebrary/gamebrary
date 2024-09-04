<template lang="html">
  <section class="d-flex flex-column">
    <portal to="pageTitle">
      <h3>Search</h3>
    </portal>

    <portal to="headerActions">
      <div class="d-flex">
        <b-button
          v-b-toggle.filtersSidebar
          title="Filters"
          :variant="filterSelected ? 'outline-primary' : darkTheme ? 'outline-success' : 'outline-primary'"
          class="mr-1 border-0"
        >
          <i class="fa-regular fa-filter" />
        </b-button>

        <SearchBox :loading="loading" />
      </div>
    </portal>

    <SearchFilters />

    <GameCard
      v-for="game in searchResults"
      class="mb-3"
      :game-id="game.id"
      :key="game.id"
    />

    <b-button
      v-if="searchResults.length === pageSize"
      block
      class="mb-2"
      @click="loadMore"
    >
      <b-spinner v-if="loading" />

      <span v-else>
        More results
      </span>
    </b-button>

    <p
      v-if="!loading && query.length > 0 && !searchResults.length"
      :class="['text-center mt-5', { 'text-info' : darkTheme }]"
    >
      No results found
    </p>
  </section>
</template>

<script>
import GameCard from '@/components/GameCard';
import SearchFilters from '@/components/SearchFilters';
import SearchBox from '@/components/SearchBox';
import { IGDB_QUERIES } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCard,
    SearchBox,
    SearchFilters,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
      pageSize: 20,
      offset: 0,
      // pageSizes: [
      //   { value: 24, text: '24' },
      //   { value: 48, text: '48' },
      //   { value: 100, text: '100' },
      // ],
    };
  },

  computed: {
    ...mapState(['boards']),
    ...mapGetters(['darkTheme']),

    filterBy() {
      return this.$route.query?.filterBy
        ? [this.$route.query?.filterBy]
        : [];
    },

    filterValue() {
      return this.$route.query?.value
        ? [this.$route.query?.value]
        : [];
    },

    query() {
      return this.$route.query.q
        ? this.$route.query.q.trim()
        : '';
    },

    boardId() {
      return this.$route.query?.boardId;
    },

    boardListIndex() {
      return this.$route.query?.listIndex;
    },

    showEmptyState() {
      return this.$route?.query?.q === undefined;
    },

    showPreviousButton() {
      return this.offset >= this.pageSize;
    },

    filterSelected() {
      return Boolean(this.$route.query?.filterBy && this.$route.query?.value);
    },
  },

  watch: {
    query(value) {
      this.offset = 0;
      this.search();
    },

    pageSize(value) {
      this.search();
    },

    filterValue(value) {
      this.offset = 0;
      this.search();
    },
  },

  async mounted() {
    if (this.filterBy || this.filterValue || !this.showEmptyState) this.search();
  },

  methods: {
    clearResults() {
      this.searchResults = [];
      this.offset = 0;
    },

    loadMore() {
      this.offset = this.offset + this.pageSize;
      this.search();
    },

    prev() {
      this.offset = this.offset - this.pageSize;
      this.search();
    },

    async search() {
      this.loading = true;

      if (this.searchResults.length > 0 && this.offset === 0) this.clearResults();

      const search = this.query
        ? `search "${this.query}";`
        : '';

      // const filter = !this.query
      //   ? 'where rating >= 80;'
      //   : '';

      const filter = this.filterBy.length && this.filterValue.length
        ? `where ${this.filterBy} = (${this.filterValue});`
        : '';

      const searchResults = await this.$store.dispatch('IGDB', {
        path: 'games',
        data: `${search} ${IGDB_QUERIES.SEARCH} limit ${this.pageSize}; offset ${this.offset}; ${filter};`,
      });

      this.searchResults = [
        ...this.searchResults,
        ...searchResults,
      ];

      this.$store.commit("CACHE_GAME_DATA", searchResults);

      this.loading = false;
    },
  },
};
</script>
