<!-- TODO: add option to clear filters -->
<!-- TODO: show option to clear search text if no results AND filters on -->
<!-- TODO: remove filter if selected -->
<!-- TODO: add sorting -->
<!-- TODO: use route query -->
<!-- TODO: change default call -->
<!-- TODO: add page size dropdown -->
<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Search</portal>

      <b-form-row>
        <!-- <b-button @click="loadMoreResults">
          load more
        </b-button> -->
      </b-form-row>

      <b-form-row>
        <b-col cols="4" sm="3">
          <search-filters />
        </b-col>

        <b-col cols="8" sm="9">
          <b-form-row>
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

            <b-button
              v-if="showPreviousButton"
              class="mr-2"
              @click="prev"
            >
              Previous
            </b-button>

            <b-button
              class="mr-2"
              v-if="searchResults.length === pageSize"
              @click="next"
            >
              Next
            </b-button>

            <b-spinner v-if="loading" class="ml-2" />

            <b-form-row class="mt-3">
              <b-col
                cols="6"
                md="4"
                lg="2"
                v-for="game in searchResults"
                :key="game.id"
              >
                <game-card-search :game="game" />
              </b-col>
            </b-form-row>

            <div
              v-if="!loading && query.length > 0 && !searchResults.length"
              class="field centered text-center mt-5"
            >
              <p>No results found</p>
            </div>
          </b-form-row>
        </b-col>
      </b-form-row>
    </b-container>
  </section>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import SearchFilters from '@/components/SearchFilters';
import orderby from 'lodash.orderby';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCardSearch,
    SearchFilters,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
      pageSize: 24,
      offset: 0,
    };
  },

  computed: {
    ...mapState(['boards']),

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

      // TODO: paginate
      const data = `${search} fields *,platforms,slug,rating,cover.image_id; limit ${this.pageSize}; offset ${this.offset}; ${filter};`;

      this.searchResults = await this.$store.dispatch('IGDB', { path: 'games', data });

      this.loading = false;
    },
  },
};
</script>
