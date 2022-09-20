<template lang="html">
  <section>
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
        <div class="mr-2">
          <b-form-input
            v-if="!showEmptyState"
            type="search"
            class="d-none d-sm-block"
            placeholder="Search notes"
            v-model="search"
          />
        </div>
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <empty-state
        v-else-if="showEmptyState"
        illustration="notes.png"
        :title="$t('notes.title')"
        message="Looks like you don't have any notes yet."
      >
        <b-button variant="light" :to="{ name: 'notes.create' }">
          Add note
        </b-button>
      </empty-state>

      <b-row v-else-if="noteGames.length">
        <b-col>
          <b-form-input
            v-if="!showEmptyState"
            type="search"
            class="d-sm-none field mb-3"
            placeholder="Search notes"
            v-model="search"
          />

          <b-card-group columns>
            <b-card
              v-for="(game, index) in noteGames"
              body-class="p-2"
              :key="index"
            >
              <b-card-text>
                <b-button
                  v-if="game"
                  variant="light"
                  size="sm"
                  class="d-flex p-2 mb-2 align-items-center"
                  :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug }}"
                >
                  <b-img
                    :src="getCoverUrl(game.id)"
                    class="cursor-pointer rounded"
                    width="30"
                  />

                  <div class="ml-2 overflow-hidden">
                    <h5>{{ game.name }}</h5>
                  </div>
                </b-button>

                <p class="note-text text-muted small" v-if="filteredNotes[index]">
                  {{ filteredNotes[index].note }}
                </p>
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </section>
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
      search: '',
      loading: false,
    };
  },

  computed: {
    ...mapState(['notes', 'games']),

    showEmptyState() {
      return !this.loading && !Object.keys(this.notes).length;
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
      const gamesList = Object.keys(this.notes);

      if (!gamesList) return;

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
.note-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>

