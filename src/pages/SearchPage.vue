<template lang="html">
  <b-container>
    <b-row>
      <b-col cols="3" class="position-sticky mt-2">
        <b-card>
          test
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
        </b-card>
      </b-col>

      <b-col cols="9">
        <div class="p-2">
          <search-box />
          <!-- <b-alert show variant="success">
            Custom search controls go here!
          </b-alert> -->
          <!-- TODO: add filters -->
          <!-- TODO: add empty state with predefined searches -->
          <!-- TODO: add pagination -->
          <b-skeleton v-if="loading" />

          <div v-else-if="searchResults.length > 0">
            <header class="my-2 d-flex align-items-center justify-content-between">
              <h3>Search results</h3>

              <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                <b-button-group class="mx-1">
                  <b-button :variant="listView ? 'primary' : 'secondary'" @click="listView = true">
                    <i class="fa-solid fa-list fa-fw" aria-hidden />
                  </b-button>

                  <b-button :variant="listView ? 'secondary' : 'primary'" @click="listView = false">
                    <i class="fa-solid fa-grip fa-fw" aria-hidden />
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </header>

            <template v-if="listView">
              <game-card-search
                v-for="game in searchResults"
                :key="game.id"
                :game="game"
              />
            </template>

            <div v-else class="masonry-container">
              <game-card-search-vertical
                v-for="game in searchResults"
                class="masonry-item"
                :key="game.id"
                :game="game"
              />
            </div>
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
import SearchBox from '@/components/SearchBox';
import GameCardSearchVertical from '@/components/GameCards/GameCardSearchVertical';

export default {
  components: {
    GameCardSearch,
    SearchBox,
    GameCardSearchVertical,
  },

  data() {
    return {
      searchResults: [],
      loading: false,
      listView: true,
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
.masonry-container {
 column-count: 5;
 column-gap: 1rem;
}

.masonry-item {
 display: inline-block;
 width: 100%;
}
</style>
