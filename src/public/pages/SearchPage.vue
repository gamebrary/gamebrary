<!-- TODO: add sorting -->
<!-- TODO: change default call -->
<!-- TODO: cache last search -->
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
        <b-col cols="3">
          <search-filters />
        </b-col>

        <b-col cols="9">
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

            <b-spinner v-if="loading" class="spinner-centered" />

            <b-col
              v-else-if="searchResults.length"
              cols="6"
              md="4"
              lg="2"
              v-for="game in searchResults"
              :key="game.id"
            >
              <game-card-search :game="game" />
            </b-col>

            <div
              v-else-if="query.length > 0"
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
      results: null,
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
  },

  watch: {
    query(value) {
      this.search();
    },

    filterValue(value) {
      this.search();
    },

    filterType(value) {
      this.search();
    },
  },

  async mounted() {
    this.search();
    this.test();
  },

  methods: {
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
      const data = `${search} fields *,platforms,slug,rating,cover.image_id; limit 100; ${filter}`;

      this.searchResults = await this.$store.dispatch('IGDB', { path: 'games', data });

      this.loading = false;
    },

    async test() {
      const data = `fields *, content_descriptions.*; limit 100;`;

      this.results = await this.$store.dispatch('IGDB', { path: 'age_ratings', data });
    },
  },
};
</script>
