<template lang="html">
  <b-container>
    <b-row>
      <portal to="headerTitle">
        <div class="w-100 d-flex align-items-center justify-content-between">
          <h3 class="m-0">Search</h3>

          <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="mr-1">
            <b-button-group class="mx-1">
              <b-button :variant="listView ? 'primary' : 'light'" @click="listView = true">
                <i class="fa-solid fa-list fa-fw" aria-hidden />
              </b-button>

              <b-button :variant="listView ? 'light' : 'primary'" @click="listView = false">
                <i class="fa-solid fa-grip fa-fw" aria-hidden />
              </b-button>
            </b-button-group>
          </b-button-toolbar>
        </div>
      </portal>
      <!-- TODO: add filters -->
      <!-- TODO: add view toggle -->
        <!-- <b-col cols="3" class="position-sticky mt-2">
          <b-card>
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
        </b-col> -->

      <!-- <b-col cols="9">

      </b-col> -->
      <div class="p-2">
        <b-button
          v-if="boardId"
          variant="primary"
          :to="{ name: 'board', params: { id: boardId } }"
        >
          Back to board
        </b-button>
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
            <h3 v-if="activeBoardList.length">
              Add games to <strong>{{ activeBoardList.name }}</strong>
            </h3>
            <h3>Search results</h3>


          </header>

          <template v-if="listView">
            <game-card-search
              v-for="game in searchResults"
              :key="game.id"
              :game="game"
              :active-list="Boolean(activeBoardList)"
              @addToActiveList="addToActiveList"
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
    </b-row>
  </b-container>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import SearchBox from '@/components/SearchBox';
import GameCardSearchVertical from '@/components/GameCards/GameCardSearchVertical';
import { mapState } from 'vuex';

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
      listView: false,
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
      // todo: Avoid search if new/old values are same
      this.search(value);
    },
  },

  mounted() {
    this.search();
  },

  methods: {
    async addToActiveList({ list, listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];

      board.lists[listIndex].games.push(this.game.id);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

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
