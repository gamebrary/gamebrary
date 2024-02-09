<template lang="html">
  <section class="d-flex flex-column">
    <portal to="pageTitle">
      <h3>Search</h3>
    </portal>

    <div class="d-flex">
      <SearchBox :loading="loading" />

      <div>
        <b-button
          v-if="showPreviousButton"
          @click="prev"
        >
          <i class="fa-solid fa-caret-left" aria-hidden="true" />
          Prev
        </b-button>

        <b-button
          class="ml-3"
          v-if="searchResults.length === pageSize"
          @click="next"
        >
          Next
          <i class="fa-solid fa-caret-right" aria-hidden="true" />
        </b-button>
      </div>
    </div>

    <header class="mb-3 d-flex justify-content-between bg-danger">
      <!-- <b-button v-b-modal.filters>
        <i class="fa-solid fa-sliders" />
        Filters
      </b-button>

      <search-filters /> -->
    </header>

    <masonry
      gutter="16px"
      :cols="{ default: 7, 1200: 5, 768: 3, 480: 2 }"
    >
      <game-card-search
        v-for="game in searchResults"
        :game="game"
        :key="game.id"
      />
    </masonry>

    <b-button
      v-if="searchResults.length === pageSize"
      block
      class="mb-2"
      @click="next"
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
import GameCardSearch from '@/components/GameCards/GameCardSearch';
// import SearchFilters from '@/components/SearchFilters';
import SearchBox from '@/components/SearchBox';
import orderby from 'lodash.orderby';
import { IGDB_QUERIES } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCardSearch,
    SearchBox,
    // SearchFilters,
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

    // activeBoard() {
    //   return this.boards.find(({ id }) => id === this.boardId);
    // },
    //
    // activeBoardList() {
    //   if (this.boardListIndex === undefined) return [];
    //
    //   return this.activeBoard?.lists[this.boardListIndex];
    // },

    showEmptyState() {
      return this.$route?.query?.q === undefined;
    },

    showPreviousButton() {
      return this.offset >= this.pageSize;
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

    filterType(value) {
      this.offset = 0;
      this.search();
    },
  },

  async mounted() {
    if (this.filterBy || this.filterValue || !this.showEmptyState) this.search();
  },

  methods: {
    next() {
      this.offset = this.offset + this.pageSize;
      this.search();
    },

    prev() {
      this.offset = this.offset - this.pageSize;
      this.search();
    },

    async search() {
      this.loading = true;

      const search = this.query
        ? `search "${this.query}";`
        : '';

      // const filter = !this.query
      //   ? 'where rating >= 80;'
      //   : '';

      const filter = this.filterBy.length && this.filterValue.length
        ? `where ${this.filterBy} = (${this.filterValue});`
        : '';

      this.searchResults = await this.$store.dispatch('IGDB', {
        path: 'games',
        data: `${search} ${IGDB_QUERIES.SEARCH} limit ${this.pageSize}; offset ${this.offset}; ${filter};`,
      });

      this.loading = false;
    },
  },
};
</script>
