<template lang="html">
  <b-container>
    <page-title :title="$t('notes.title')" />

    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <portal to="headerActions">
        <game-selector
          v-if="!isEmpty"
          title="Select game to add a note"
          size="md"
          :variant="darkTheme ? 'success' : 'primary'"
          :class="{ 'mr-3': !isVerticalNav }"
          @select-game="createNote"
        >
          <i
            v-if="isVerticalNav"
            class="fa-solid fa-plus fa-fw"
          />

          <template v-else>
            <i class="d-sm-none fa-solid fa-plus" />
            <span class="d-none d-sm-inline">Create note</span>
          </template>
        </game-selector>
      </portal>

      <empty-state
        v-if="isEmpty"
        illustration="notes"
      >
        <p>Looks like you don't have any notes yet.</p>
        <p>Use notes to keep track of cheat codes, passwords, or pretty much anything!</p>

        <game-selector
          v-if="user"
          title="Select game to add a note"
          trigger-text="Create note"
          size="md"
          variant="primary"
          class="mr-2"
          @select-game="createNote"
        />

        <!-- <b-button
          v-else
          :to="{ name: 'auth' }"
        >
          Login
        </b-button> -->
      </empty-state>

      <empty-state
        v-else-if="searchText.length && !filteredNotes.length"
        illustration="notes"
        message="No results"
      >
        <b-button @click="searchText = ''">
          Clear search
        </b-button>
      </empty-state>

      <template v-else>
        <b-form-input
            type="search"
            class="field mb-3"
            placeholder="Search notes"
            v-model="searchText"
          />

          <masonry
            :cols="{ default: 4, 1000: 3, 700: 2, 400: 1 }"
            gutter="8px"
          >
            <b-card
              v-for="({ note, game }, index) in filteredNotes"
              body-class="p-2"
              :bg-variant="darkTheme ? 'dark' : 'light'"
              :text-variant="darkTheme ? 'light' : 'dark'"
              :key="index"
              class="cursor-pointer mb-2"
              @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
            >
              <b-card-text v-if="game">
                <b-img
                  :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
                  height="80"
                  class="cursor-pointer rounded float-left mr-3"
                />

                <div class="ml-2 overflow-hidden">
                  <h5>{{ game.name }}</h5>
                </div>

                <p class="note-text small" v-if="note" v-html="note" />
              </b-card-text>
            </b-card>
          </masonry>
      </template>
    </template>
  </b-container>
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
    ...mapState(['notes', 'cachedGames', 'user']),
    ...mapGetters(['darkTheme', 'isVerticalNav']),

    isEmpty() {
      return !Object.keys(this.notes).length;
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
    this.loadGames();
  },

  methods: {
    createNote(gameId) {
      const game = this.cachedGames[gameId];

      this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
    },

    async loadGames() {
      if (this.isEmpty) return;

      const gamesList = Object.keys(this.notes);

      this.loading = true;

      try {
        await this.$store.dispatch('LOAD_IGDB_GAMES', gamesList);
      } catch (e) {
        this.$bvToast.toast('Error loading games', { variant: 'error' });
      }

      this.loading = false;
    },
  },
};
</script>
