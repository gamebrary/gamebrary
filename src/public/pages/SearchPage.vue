<!-- TODO: add sorting -->
<!-- TODO: change default call -->
<!-- TODO: Cache last search -->
<!-- TODO: clear filter if selected platform is not available -->
<!-- TODO: Add platform filtering by text -->
<!-- TODO: user route params for filtering values -->
<!-- TODO: use pills with close button to remove filter -->
<!-- TODO: do proper backend filtering -->
<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Search</portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <b-form-row v-else-if="searchResults.length">
        <portal to="headerActions">
          <b-dropdown
            id="dropdown-1"
            variant="light"
            class="mr-2"
            right
          >
            <template #button-content>
              Filter <template v-if="selectedPlatforms.length">({{ selectedPlatforms.length }})</template>
            </template>

            <b-dropdown-item
              v-for="{ id, count, name } in platformsAvailable"
              v-show="Boolean(name)"
              :key="id"
              :active="selectedPlatforms.includes(id)"
              @click="selectPlatform(id)"
            >
              {{ name }} ({{ count }})
            </b-dropdown-item>

            <template v-if="selectedPlatforms.length">
              <b-dd-divider />

              <b-dropdown-item @click="selectedPlatforms = []">
                Clear filters
              </b-dropdown-item>
            </template>
          </b-dropdown>
        </portal>

        <b-col cols="12" class="bg-light py-2 mb-3" v-if="activeBoard">
          <div class="d-flex align-items-center">
            <span class="d-none d-sm-block">
              Add games to:
            </span>

            <b-button-group class="ml-sm-2">
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
                  :to="{ name: 'search', query: { boardId: board.id, listIndex: 0, q: query } }"
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
                  :to="{ name: 'search', query: { boardId: activeBoard.id, listIndex, q: query } }"
                >
                  {{ list.name }}
                </b-dropdown-item>
              </b-dropdown>
            </b-button-group>

            <b-button :to="{ name: 'search' }" class="ml-auto" variant="light">
              <i class="fas fa-times fa-fw" aria-hidden />

              <span class="d-none d-sm-inline">
                Clear
              </span>
            </b-button>
          </div>
        </b-col>

        <b-col
          cols="6"
          md="4"
          lg="2"
          v-for="game in formattedSearchResults"
          :key="game.id"
        >
          <game-card-search :game="game" />
        </b-col>
      </b-form-row>

      <div
        v-else-if="query.length > 0"
        class="field centered text-center mt-5"
      >
        <p>No results found</p>
      </div>
    </b-container>
  </section>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCardSearch,
  },

  data() {
    return {
      searchResults: [],
      selectedPlatforms: [],
      loading: false,
    };
  },

  computed: {
    ...mapState(['boards']),
    ...mapGetters(['platformNames']),

    platformsAvailable() {
      const platformsInResults = this.searchResults?.map((game) => game?.platforms).flat();

      const occurrences = platformsInResults.reduce((acc, curr) => {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

      return Object.entries(occurrences).map(([id, count]) => {
        return {
          ...this.platformNames[id],
          count,
          id,
        };
      })
    },

    filteredResults() {
      return this.selectedPlatforms.length > 0
        ? this.searchResults.filter(({ platforms }) => platforms?.some((id) => this.selectedPlatforms?.includes(String(id))))
        : this.searchResults;
    },

    formattedSearchResults() {
      return this.filteredResults?.map((game) => {
        const platforms = game?.platforms?.map((id) => ({ id, ...this.platformNames?.[id] }));

        return { ...game, platforms };
      });
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

    showEmptyState() {
      return this.$route?.query?.q === undefined;
    },
  },

  watch: {
    query(value) {
      this.search(value);
    },
  },

  async mounted() {
    if (this.showEmptyState) {
    } else {
      this.search();
    }
  },

  methods: {
    async search() {
      this.loading = true;

      const search = this.query
        ? `search "${this.query}";`
        : '';

      const data = `${search} fields platforms,slug,cover.image_id; limit 50;`;

      this.searchResults = await this.$store.dispatch('IGDB', { path: 'games', data });

      this.loading = false;
    },

    selectPlatform(id) {
      if (this.selectedPlatforms.includes(id)) {
        const index = this.selectedPlatforms.indexOf(id);

        this.selectedPlatforms.splice(index, 1);
      } else {
        this.selectedPlatforms.push(id);
      }
    },
  },
};
</script>
