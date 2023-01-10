<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <h3>Notes</h3>
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <template v-else>
        <portal v-if="!isEmpty" to="headerActions">
          <div class="d-flex">
            <game-selector
              title="Select game to add a note"
              trigger-text="Create note"
              size="md"
              variant="primary"
              class="mr-2"
              @select-game="createNote"
            />
          </div>
        </portal>

        <empty-state
          v-if="isEmpty"
          :title="$t('notes.title')"
          message="Looks like you don't have any notes yet."
        >
          <game-selector
            title="Select game to add a note"
            trigger-text="Create note"
            size="md"
            variant="primary"
            class="mr-2"
            @select-game="createNote"
          />
        </empty-state>

        <div v-else-if="searchText.length && !filteredNotes.length">
          <p>No results</p>

          <b-button @click="searchText = ''">
            Clear search
          </b-button>
        </div>

        <b-row v-else>
          <b-col>
            <b-form-input
              type="search"
              class="field mb-3"
              placeholder="Search notes"
              v-model="searchText"
            />

            <b-card-group columns>
              <b-card
                v-for="({ note, game }, index) in filteredNotes"
                body-class="p-2"
                :bg-variant="darkTheme ? 'secondary' : 'light'"
                :text-variant="darkTheme ? 'light' : 'dark'"
                :key="index"
                class="cursor-pointer"
                @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
              >
                <b-card-text v-if="game">
                  <b-img
                    :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
                    height="80"
                    class="cursor-pointer rounded float-left mr-3 mb-2"
                  />

                  <div class="ml-2 overflow-hidden">
                    <h5>{{ game.name }}</h5>
                  </div>

                  <p class="note-text small" v-if="note" v-html="note" />
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
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

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

