<!-- TODO: add filters -->
<!-- TODO: add empty state with predefined searches -->
<!-- TODO: add pagination -->
<template lang="html">
  <b-container>
    <portal to="pageTitle">Search</portal>

    <portal to="headerActions">
      <search-box class="mr-2 d-none d-sm-block" />
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else-if="searchResults.length">
      <b-col cols="12">
        <search-box class="field mb-3 d-sm-none" />
      </b-col>

      <b-col cols="12" class="bg-light py-2 mb-3" v-if="activeBoard">
        <b-button-group>
          <b-dropdown
            split
            variant="light"
            :split-to="{ name: 'board', params: { id: boardId } }"
            :text="activeBoard.name"
          >
            <b-dropdown-item
              v-for="board in boards"
              :key="board.id"
              :disabled="!board.lists.length"
              :to="{ name: 'search', query: { boardId: board.id, listIndex: 0 } }"
            >
              {{ board.name }}
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            v-if="activeBoardList"
            split
            variant="light"
            :split-to="{ name: 'board', params: { id: boardId } }"
            :text="activeBoardList.name"
          >
            <b-dropdown-item
              v-for="(list, listIndex) in activeBoard.lists"
              :key="list.id"
              :to="{ name: 'search', query: { boardId: activeBoard.id, listIndex } }"
            >
              {{ list.name }}
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>

        <b-button :to="{ name: 'search' }" class="ml-auto" variant="outline-dark">
          <i class="fas fa-times fa-fw" aria-hidden />
          Clear
        </b-button>
      </b-col>

      <b-col
        cols="6"
        md="4"
        lg="2"
        v-for="game in searchResults"
        :key="game.id"
      >
        <game-card-search :game="game" />
      </b-col>
    </b-row>

    <div
      v-else-if="query.length > 0"
      class="text-center mt-5 ml-auto mr-auto"
    >
      <p>No results found</p>

      <b-button
        :to="{ name: 'search' }"
        variant="light"
      >
        Clear search
      </b-button>
    </div>
  </b-container>
</template>

<script>
import SearchBox from '@/components/SearchBox';
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState } from 'vuex';

export default {
  components: {
    SearchBox,
    GameCardSearch,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
    };
  },

  computed: {
    ...mapState(['boards']),

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

    selectable() {
      return Boolean(this.boardListIndex >= 0 && this.boardId);
    },

    activeBoard() {
      return this.boards.find(({ id }) => id === this.boardId);
    },

    activeBoardList() {
      if (this.boardListIndex === undefined) return [];

      return this.activeBoard?.lists[this.boardListIndex];
    },
  },

  watch: {
    query(value) {
      this.search(value);
    },
  },

  async mounted() {
    this.search();
  },

  methods: {
    async search() {
      this.loading = true;

      const search = this.query
        ? `search "${this.query}";`
        : '';

      const data = `${search} fields *,cover.*; limit 50;`;

      this.searchResults = await this.$store.dispatch('IGDB', { path: 'games', data });

      this.loading = false;
    },
  },
};
</script>
