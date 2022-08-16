<!-- TODO: allow notes to be public -->
<!-- TODO: pagination? -->
<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'settings' }"
          variant="light"
          class="mr-2"
          >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Notes
      </div>
    </portal>

    <portal to="headerActions">
      <b-form-input
        v-if="!showEmptyState"
        type="search"
        style="max-width: 200px"
        class="mr-3"
        placeholder="Search notes"
        v-model="search"
      />
    </portal>

    <empty-state
      v-if="showEmptyState"
      :title="$t('notes.title')"
      message="Looks like you don't have any notes yet."
    />

    <b-row v-else>
      <b-col cols="6" v-if="noteGames.length">
        <!-- TODO: make computed for note selector -->
        <div
          v-for="(game, index) in noteGames"
          :key="index"
        >
          <b-img
            v-if="game && game.id"
            :src="getCoverUrl(game.id)"
            class="cursor-pointer"
            thumbnail
            @click="selectedNote = filteredNotes[index]"
          />

          <b-button
            v-if="game && game.name"
            @click="selectedNote = filteredNotes[index]"
          >
            {{ game.name }}
          </b-button>
        </div>
      </b-col>

      <b-col>
        <game-note :note="selectedNote" v-if="selectedNote" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import GameNote from '@/components/GameNote';
import { mapState } from 'vuex';

export default {
  components: {
    EmptyState,
    GameNote,
  },

  data() {
    return {
      selectedNote: null,
      loaded: false,
      search: '',
    };
  },

  computed: {
    ...mapState(['notes', 'games']),

    showEmptyState() {
      return this.loaded && !Object.keys(this.notes).length;
    },

    noteGames() {
      return Object.keys(this.notes).map((id) => this.games[id]);
    },

    // TODO: move to getter?
    filteredNotes() {
      return Object.values(this.notes)
        .map((note, index) => {
          const gameId = Object.keys(this.notes)[index];
          const game = gameId && this.games && this.games[gameId];

          return {
            note,
            gameName: game && game.name,
            gameSlug: game && game.slug,
            gameId: game && game.id,
          };
        })
        .filter(({ gameName, note }) => {
          if (!this.search) return true;

          const noteIsMatch = note && note.toLowerCase().includes(this.search.toLowerCase());
          const titleIsMatch = gameName && gameName.toLowerCase().includes(this.search.toLowerCase());

          return noteIsMatch || titleIsMatch;
        });
    },
  },

  mounted() {
    this.loadGames();

    if (this.filteredNotes.length > 0) this.selectedNote = this.filteredNotes[0];
  },

  methods: {
    async loadGames() {
      const gamesList = Object.keys(this.notes).length
        ? Object.keys(this.notes).toString()
        : null;

      if (!gamesList) {
        this.loaded = true;

        return;
      }

      // TODO: get list of games that aren't currently cached

      await this.$store.dispatch('LOAD_GAMES', gamesList)
        .catch(() => {
          this.$bvToast.toast('Error loading games', { variant: 'error' });
        });

      this.loaded = true;
    },

    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },
  },
};
</script>
