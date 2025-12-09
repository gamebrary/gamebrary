<template lang="html">
  <div class="px-3">
    <portal v-if="user && !isEmpty" to="headerActions">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-success' : 'btn-dark'"
          type="button"
          id="notesDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Notes
        </button>
        <ul class="dropdown-menu" aria-labelledby="notesDropdown">
          <li>
            <button
              type="button"
              class="dropdown-item"
              :class="darkTheme ? 'text-light' : ''"
              @click="openGameSelectorSidebar"
            >
              <i class="fa-solid fa-plus" />
              Add note
            </button>
          </li>
          <li>
            <button
              type="button"
              class="dropdown-item"
              :class="darkTheme ? 'text-light' : ''"
              @click="showSearch = !showSearch"
            >
              <i class="fa-solid fa-magnifying-glass" />
              Search
            </button>
          </li>
        </ul>
      </div>
    </portal>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <input
        v-if="showSearch"
        type="search"
        class="form-control mb-3"
        placeholder="Search notes"
        v-model="searchText"
      />

      <EmptyState
        v-if="isEmpty"
        illustration="notes"
      >
        <p>Looks like you haven't added any notes yet.</p>
        <p>Notes are handy for keeping track of cheat codes, passwords, or just about anything you want to remember!</p>

        <button
          type="button"
          class="btn"
          :class="darkTheme ? 'btn-success' : 'btn-primary'"
          @click="openGameSelectorSidebar"
          :title="'Add games'"
        >
          Create note
        </button>
      </EmptyState>

      <EmptyState
        v-else-if="searchText.length && !filteredNotes.length"
        illustration="notes"
        message="No results"
      >
        <button
          type="button"
          class="btn"
          :class="darkTheme ? 'btn-dark' : 'btn-light'"
          @click="searchText = ''"
        >
          Clear search
        </button>
      </EmptyState>

      <template v-else>
        <div
          v-for="({ note, game }, index) in filteredNotes"
          :key="index"
          class="d-flex align-items-start mb-3"
        >
          <div class="flex-shrink-0 me-3">
            <GameCard
              :game-id="game.id"
              small
              hide-notes
              hide-progress
              vertical
              hide-title
              hide-platforms
            />
          </div>

          <div class="flex-grow-1">
            <h2>{{ game.name }}</h2>

            <div
              v-if="note"
              v-html="note"
              class="alert alert-warning cursor-pointer mt-3 mb-0"
              role="alert"
              @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    EmptyState,
    GameCard,
  },

  data() {
    return {
      searchText: '',
      loading: false,
      showSearch: false,
    };
  },

  computed: {
    ...mapState(['notes', 'cachedGames', 'user']),
    ...mapGetters(['darkTheme', 'buttonProps']),

    isEmpty() {
      return !this.notes || !Object.keys(this.notes)?.length;
    },

    filteredNotes() {
      const notes = Object.entries(this.notes).map(([gameId, note]) => ({
        note,
        game: this.cachedGames?.[gameId],
      }));

      const searchText = this.searchText?.toLowerCase();

      if (searchText) {
        return notes.filter(({ game, note }) => {
          const noteIsMatch = note?.toLowerCase()?.includes(searchText);
          const titleIsMatch = game?.name?.toLowerCase()?.includes(searchText);

          return noteIsMatch || titleIsMatch;
        });
      }

      return notes;
    },
  },

  mounted() {
    this.$bus.$on('SELECT_GAME', this.openNote);
    this.loadGames();
  },

  beforeUnmount() {
    this.$bus.$off('SELECT_GAME', this.openNote);
  },

  methods: {
    async loadGames() {
      const gamesNotCached = Object.entries(this.notes)
        .map(([gameId]) => (gameId))
        .filter((gameId) => !this.cachedGames[gameId]);

      if (gamesNotCached.length > 0) await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
    },

    openGameSelectorSidebar() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: 'Select game to add a note',
      });
    },

    createNote(gameId) {
      const game = this.cachedGames[gameId];

      this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
    },

    openNote(id) {
      const game = this.cachedGames[id];

      this.$router.push({ name: 'game.notes', params: { id, slug: game.slug }});
    },
  },
};
</script>
