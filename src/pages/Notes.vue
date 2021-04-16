<!-- TODO: pagination? -->
<!-- TODO: open notes from game modal on click? -->
<template lang="html">
  <div>
    <portal to="dock">
      <div class="d-flex">
        <b-form-input
          v-if="!showEmptyState"
          type="search"
          style="max-width: 200px"
          placeholder="Search notes"
          v-model="search"
        />

        <!-- TODO: create add a note modal -->
        <!-- <b-button variant="warning" class="ml-2" style="width: 120px;">
          Add note
        </b-button> -->
      </div>
    </portal>

    <empty-state
      v-if="showEmptyState"
      :title="$t('notes.title')"
      message="Looks like you don't have any notes yet."
    />

    <template v-else>
      <div class="notes mb-2">
        <b-alert
          show
          v-for="{ note, gameName, gameId } in filteredNotes"
          class="border note"
          variant="warning"
          :key="gameId"
        >
          <strong v-if="gameName">
            {{ gameName }} ({{ note.length }})
          </strong>

          <vue-markdown :source="note" />
        </b-alert>
      </div>
    </template>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import EmptyState from '@/components/EmptyState';
import { mapState } from 'vuex';

export default {
  components: {
    VueMarkdown,
    EmptyState,
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

    filteredNotes() {
      return Object.values(this.notes)
        .map((note, index) => {
          const gameId = Object.keys(this.notes)[index];
          const game = gameId && this.games && this.games[gameId];

          return {
            note,
            gameName: game && game.name,
            gameId: game && game.id,
          };
        })
        .filter(({ gameName, note }) => {
          if (!this.search) {
            return true;
          }

          const noteIsMatch = note && note.toLowerCase().includes(this.search.toLowerCase());
          const titleIsMatch = gameName
            && gameName.toLowerCase()
              .includes(this.search.toLowerCase());

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

    openGame(gameId) {
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
      this.$bvModal.show('game-modal');
    },

    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.notes {
  column-width: 320px;
  column-gap: 15px;
  column-fill: auto;
}

.note {
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  transform: translateX(0);
}
</style>

<style lang="scss" rel="stylesheet/scss">
img, pre {
  max-width: 100%;
}
</style>
