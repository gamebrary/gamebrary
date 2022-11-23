<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Notes</portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <template v-else>
        <portal to="headerActions">
          <div class="d-flex">
            <game-selector
              title="Select game to add a note"
              trigger-text="Create note"
              size="md"
              class="mr-2"
              @select-game="createNote"
            />

            <!-- <b-form-input
              type="search"
              class="d-none d-sm-block mr-2"
              placeholder="Search notes"
              v-model="searchText"
            /> -->
          </div>
        </portal>

        <empty-state
          v-if="isEmpty"
          :title="$t('notes.title')"
          message="Looks like you don't have any notes yet."
        >
          <b-button variant="light" :to="{ name: 'notes.create' }">
            Add note
          </b-button>
        </empty-state>

        <div v-else-if="searchText.length && !filteredNotes.length">
          <!-- TODO: handle no results, clear search -->
          no results
        </div>

        <b-row v-else>
          <b-col>
            <b-form-input
              type="search"
              class="d-sm-none field mb-3"
              placeholder="Search notes"
              v-model="searchText"
            />

            <b-card-group columns>
              <b-card
                v-for="({ note, game }, index) in filteredNotes"
                body-class="p-2"
                :bg-variant="darkTheme ? 'info' : 'light'"
                :text-variant="darkTheme ? 'light' : 'dark'"
                :key="index"
              >
                <b-card-text>
                  <b-button
                    v-if="game"
                    :variant="darkTheme ? 'secondary' : 'light'"
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

                  <p class="note-text text-muted small" v-if="note">
                    {{ note }}
                  </p>
                </b-card-text>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
      </template>
    </b-container>
  </section>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import GameSelector from '@/components/GameSelector';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    EmptyState,
    GameSelector,
  },

  data() {
    return {
      searchText: '',
      loading: false,
    };
  },

  computed: {
    ...mapState(['notes', 'games']),
    ...mapGetters(['darkTheme']),

    isEmpty() {
      return !Object.keys(this.notes).length;
    },

    filteredNotes() {
      const notes = Object.entries(this.notes).map(([gameId, note]) => ({
        note,
        game: this.games?.[gameId],
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
    this.loadGames();
  },

  methods: {
    createNote(gameId) {
      const game = this.games[gameId];

      this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
    },

    async loadGames() {
      if (this.isEmpty) return;

      const gamesList = Object.keys(this.notes);

      this.loading = true;

      try {
        await this.$store.dispatch('LOAD_GAMES', gamesList);
      } catch (e) {
        this.$bvToast.toast('Error loading games', { variant: 'error' });
      }

      this.loading = false;
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

