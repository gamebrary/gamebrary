<template lang="html">
  <b-container>
    <b-row>
      <b-col cols="3">
        <!-- TODO: add filters -->
        <!-- TODO: add view toggle -->
        Filter

        <h3>Sort by</h3>
        Latest
        Oldest
        Relevance

        <h3>Filters</h3>
        Tags
        Genre
        Platform
        Year released
      </b-col>

      <b-col cols="9">
        <div class="search-page bg-white p-2">

          <!-- <b-alert show variant="success">
            Custom search controls go here!
          </b-alert> -->
          <!-- TODO: add filters -->
          <!-- TODO: add empty state with predefined searches -->
          <!-- TODO: add pagination -->
          <b-skeleton v-if="loading" />

          <div v-else-if="searchResults.length > 0">
            <h3>Search results</h3>

            <game-card-search
              v-for="game in searchResults"
              :key="game.id"
              :game="game"
            />
          </div>

          <b-container v-else-if="query.length > 0">
            <b-alert show variant="info" class="mt-5">
              <h4 class="alert-heading">No results found</h4>
              <hr>
              <p class="mb-0">
                Please try a different search
              </p>
            </b-alert>
          </b-container>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';

export default {
  components: {
    GameCardSearch,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
    };
  },

  computed: {
    query() {
      return this.$route.query.q
        ? this.$route.query.q.trim()
        : '';
    },
  },

  watch: {
    query(value) {
      // todo: Avoid search if new/old values are same
      this.search(value);
    },
  },

  mounted() {
    this.search();
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

<style lang="scss" rel="stylesheet/scss" scoped>
.search-page {
  min-height: calc(100vh - 46px);
}
</style>
