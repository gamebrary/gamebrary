<!-- TODO: pagination? -->
<template lang="html">
  <b-container>
    <page-title
      title="Notes"
    >
      <b-form-input
        v-if="!showEmptyState"
        type="search"
        style="max-width: 200px"
        placeholder="Search notes"
        v-model="search"
      />

      <!-- <b-button>
        Add note
      </b-button> -->
    </page-title>

    <empty-state
      v-if="showEmptyState"
      :title="$t('notes.title')"
      message="Looks like you don't have any notes yet."
    />

    <template v-else>
      <div class="notes mb-2">
        <game-note
          v-for="(note, index) in filteredNotes"
          :key="index"
          :note="note"
        />
      </div>
    </template>
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
      loaded: false,
      search: '',
    };
  },

  computed: {
    ...mapState(['notes', 'games']),

    showEmptyState() {
      return this.loaded && !Object.keys(this.notes).length;
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
  },

  methods: {
    getNoteHeight(noteLength) {
      if (noteLength < 50) {
        return 100;
      }

      if (noteLength < 200) {
        return 300;
      }

      return 200;
    },

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

<style lang="scss" rel="stylesheet/scss" scoped>

// .notes {
//   column-width: 320px;
//   column-gap: 15px;
//   column-fill: auto;
// }
</style>
