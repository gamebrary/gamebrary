<!-- TODO: add filters -->
<!-- TODO: add view toggle -->
<!-- TODO: add empty state with predefined searches -->
<!-- TODO: add pagination -->
<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">Search</portal>

    <portal to="headerActions">
      <search-box class="mr-2" />
    </portal>

    <b-skeleton v-if="loading" />

    <b-row v-else-if="searchResults.length">
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
    ...mapState(['board']),

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

    activeBoardList() {
      if (this.boardListIndex === undefined) return [];

      return this.board?.lists[this.boardListIndex];
    },
  },

  watch: {
    query(value) {
      // TODO: Avoid search if new/old values are same
      this.search(value);
    },
  },

  mounted() {
    if (this.query.length) this.search();
  },

  methods: {
    async search() {
      this.loading = true;

      this.searchResults = await this.$store.dispatch('CUSTOM_SEARCH', { searchText: this.query })

      this.loading = false;
    },
  },
};
</script>
