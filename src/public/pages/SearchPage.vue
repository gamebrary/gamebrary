<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <h3>Search</h3>
      </portal>
      <!-- TODO: show result count, align search box to right -->

      <b-form-row>
        <search-box :loading="loading" />

        <b-col v-if="activeBoard">
          <div class="d-flex align-items-center">
            <span class="d-none d-sm-block">
              Add games to
              <strong v-if="activeBoard.type === 'list'">
                {{ activeBoard.name }}
              </strong>
            </span>

            <template v-if="activeBoard.type !== 'list'">
              <b-dropdown
                split
                variant="light"
                size="sm"
                class="ml-2"
                :split-to="{ name: 'board', params: { id: boardId } }"
                :text="activeBoard.name"
              >
                <b-dropdown-item
                  v-for="board in boards"
                  :key="board.id"
                  :disabled="!board.lists.length"
                  :to="{ name: 'search', query: { boardId: board.id, listIndex: 0, q: query } }"
                >
                  {{ board.name }}
                </b-dropdown-item>
              </b-dropdown>

              <b-dropdown
                v-if="activeBoardList"
                split
                variant="light"
                size="sm"
                class="ml-2"
                :split-to="{ name: 'board', params: { id: boardId } }"
                :text="activeBoardList.name"
              >
                <b-dropdown-item
                  v-for="(list, listIndex) in activeBoard.lists"
                  :key="list.id"
                  :to="{ name: 'search', query: { boardId: activeBoard.id, listIndex, q: query } }"
                >
                  {{ list.name }}
                </b-dropdown-item>
              </b-dropdown>
            </template>

            <b-button :to="{ name: 'search' }" class="ml-auto" variant="light">
              <i class="fas fa-times fa-fw" aria-hidden />

              <span class="d-none d-sm-inline">
                Clear
              </span>
            </b-button>
          </div>
        </b-col>

        <b-col>
          <header class="mb-3 d-flex justify-content-between">
            <b-button v-b-modal.filters>
              <i class="fa-solid fa-sliders" />
              Filters
            </b-button>

            <search-filters />

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
          </header>

          <masonry
            gutter="8px"
            :cols="{ default: 7, 1200: 5, 768: 3, 480: 2 }"
          >
            <game-card-search
              v-for="game in searchResults"
              :game="game"
              :key="game.id"
            />
          </masonry>
        </b-col>

        <div
          v-if="!loading && query.length > 0 && !searchResults.length"
          class="field centered text-center mt-5"
        >
          <p>No results found</p>
        </div>
      </b-form-row>
    </b-container>
  </section>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import SearchFilters from '@/components/SearchFilters';
import SearchBox from '@/components/SearchBox';
import orderby from 'lodash.orderby';
import { IGDB_QUERIES } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCardSearch,
    SearchBox,
    SearchFilters,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
      pageSize: 200,
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

    activeBoard() {
      return this.boards.find(({ id }) => id === this.boardId);
    },

    activeBoardList() {
      if (this.boardListIndex === undefined) return [];

      return this.activeBoard?.lists[this.boardListIndex];
    },

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
    this.search();
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
