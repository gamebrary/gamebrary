<template lang="html">
  <div class="search-page bg-white p-2">
    <!-- <b-alert show variant="success">
      Custom search controls go here!
    </b-alert> -->
    <!-- TODO: add filters -->
    <!-- TODO: add empty state with predefined searches -->
    <!-- TODO: add pagination -->
    <b-skeleton v-if="loading" />

    <div v-else-if="searchResults.length > 0">
      <h5>Search results</h5>

      <b-card-group columns>
        <!-- TODO: move open method to card itself -->
        <game-card-search
          v-for="game in searchResults"
          :key="game.id"
          @click.native="openGame(game)"
          :game-id="game.id"
        />
      </b-card-group>
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
      return this.$route.query.s
        ? this.$route.query.s.trim()
        : '';
    },
  },

  watch: {
    query(value) {
      this.search(value);
    },
  },

  mounted() {
    if (this.query) this.search();
  },

  methods: {
    openGame(game) {
      this.$router.push({
        name: 'game',
        params: {
          id: game.id,
          slug: game.slug,
        },
      });
    },

    async search() {
      this.loading = true;

      this.searchResults = this.query
        ? await this.$store.dispatch('CUSTOM_SEARCH', { searchText: this.query })
        : [];

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
