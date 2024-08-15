<template lang="html">
  <div>
    <portal to="pageTitle">Notes</portal>

    <portal to="headerActions">
      <b-button
        title="Add games"
        v-b-tooltip.hover
        :variant="darkTheme ? 'success' : 'primary'"
        @click="openGameSelectorSidebar"
      >
        <i class="fa-solid fa-plus" />
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <empty-state
        v-if="!isEmpty"
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
            class="mb-3 mt-2"
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
              @click="openNote(game)"
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
  </div>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  components: {
    EmptyState,
  },

  data() {
    return {
      searchText: '',
      loading: false,
    };
  },

  computed: {
    ...mapState(['notes', 'cachedGames', 'user']),
    ...mapGetters(['darkTheme']),

    isEmpty() {
      return !Object.keys(this.notes)?.length;
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
  },

  destroyed() {
    this.$bus.$off('SELECT_GAME', this.openNote);
  },


  methods: {
    openGameSelectorSidebar() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: 'Select game to add a note',
      });
    },

    createNote(gameId) {
      const game = this.cachedGames[gameId];

      this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
    },

    openNote(gameId) {
      const game = this.cachedGames[gameId];

      this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }});
    },
  },
};
</script>
