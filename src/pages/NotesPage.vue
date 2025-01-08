<template lang="html">
  <div>
    <portal v-if="user && !isEmpty" to="headerActions">
      <b-dropdown
        text="Notes"
        :variant="darkTheme ? 'success' : 'black'"
      >
        <b-dropdown-item-button
          title="Add note"
          v-bind="buttonProps"
          @click="openGameSelectorSidebar"
        >
          <i class="fa-solid fa-plus" />
          Add note
        </b-dropdown-item-button>

        <b-dropdown-item-button
          title="Add note"
          v-bind="buttonProps"
          @click="showSearch = !showSearch"
        >
          <i class="fa-solid fa-magnifying-glass" />
          Search
        </b-dropdown-item-button>
      </b-dropdown>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <b-form-input
        type="search"
        class="mb-3"
        placeholder="Search notes"
        v-model="searchText"
      />

      <EmptyState
        v-if="isEmpty"
        illustration="notes"
      >
        <p>Looks like you haven't added any notes yet.</p>
        <p>Notes are handy for keeping track of cheat codes, passwords, or just about anything you want to remember!</p>

        <b-button
          title="Add games"
          v-b-tooltip.hover
          :variant="darkTheme ? 'success' : 'primary'"
          @click="openGameSelectorSidebar"
        >
          Create note
        </b-button>
      </EmptyState>

      <EmptyState
        v-else-if="searchText.length && !filteredNotes.length"
        illustration="notes"
        message="No results"
      >
        <b-button
          @click="searchText = ''"
          v-bind="buttonProps"
        >
          Clear search
        </b-button>
      </EmptyState>

      <template v-else>
        <b-media
          v-for="({ note, game }, index) in filteredNotes"
          :key="index"
          vertical-align="center"
        >
          <template #aside>
            <GameCard
              :game-id="game.id"
              small
              hide-notes
              hide-progress
              vertical
              hide-title
              hide-platforms
            />
          </template>

          <h2>{{ game.name }}</h2>

          <b-alert
            v-if="note"
            v-html="note"
            show
            class="cursor-pointer mt-3 mb-0"
            variant="warning"
            @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
          />
        </b-media>
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

  destroyed() {
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
