<template lang="html">
  <b-container>
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
        class="mr-3 d-none d-sm-block"
        placeholder="Search notes"
        v-model="search"
      />
    </portal>

    <empty-state
      v-if="showEmptyState"
      :title="$t('notes.title')"
      message="Looks like you don't have any notes yet."
    >
      <b-button :to="{ name: 'notes.create' }">
        Add note
      </b-button>
    </empty-state>

    <div v-else-if="noteGames.length" class="field centered">
      <b-form-input
        v-if="!showEmptyState"
        type="search"
        class="d-sm-none field mb-3"
        placeholder="Search notes"
        v-model="search"
      />

      <b-col
        v-for="(game, index) in noteGames"
        :key="index"
        cols="12"
      >
        <router-link
          v-if="game"
          tag="div"
          class="d-flex field rounded bg-light p-2 mb-2 cursor-pointer"
          :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug }}"
        >
          <b-img
            :src="getCoverUrl(game.id)"
            class="cursor-pointer "
            width="40"
          />

          <div class="ml-2">
            <h5>{{ game.name }}</h5>
            <p class="text-muted small" v-if="filteredNotes[index]">
              {{ filteredNotes[index].note }}
            </p>
          </div>
        </router-link>
      </b-col>
    </div>
  </b-container>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import { mapState } from 'vuex';

export default {
  components: {
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
