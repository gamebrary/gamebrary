<!-- TODO: create add a note modal -->
<!-- TODO: add note search -->
<!-- TODO: pagination? -->
<!-- TODO: open notes from game modal on click? -->

<template lang="html">
  <b-container class="pt-3">
    <empty-state
      v-if="showEmptyState"
      :title="$t('notes.title')"
      message="Looks like you don't have any notes yet."
    />
    <!-- TODO: update text once add note modal is ready v -->
    <!-- message="All your video game notes, in one place." -->
    <!-- actionText="Add a note" -->

    <template v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">{{ $t('notes.title') }}</h3>

        <b-button
          variant="primary"
          disabled
        >
          Add note
        </b-button>
      </div>

      <b-card
        v-for="(note, gameId) in notes"
        :key="gameId"
        class="mb-3 w-100 note"
        :bg-variant="nightMode ? 'dark' : null"
        :text-variant="nightMode ? 'white' : null"
        body-class="p-2"
        @click="openGame(gameId)"
      >
        <div class="d-flex">
          <b-img
            :src="getCoverUrl(gameId)"
            :alt="games[gameId].name"
            class="rounded"
            width="70"
          />

          <div class="ml-2">
            <h5 v-if="games[gameId]">
              {{ games[gameId] && games[gameId].name ? games[gameId].name : '' }}
            </h5>

            <b-alert show variant="warning" class="m-0">
              <vue-markdown :source="note" />
            </b-alert>
          </div>
        </div>
      </b-card>
    </template>

    <!-- TODO: finish search, include game title? -->
    <!-- <b-row class="mb-3">
      <b-form-input
        type="search"
        placeholder="Search notes"
        v-model="search"
      />
    </b-row> -->
  </b-container>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import EmptyState from '@/components/EmptyState';
import { mapState, mapGetters } from 'vuex';

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
    ...mapGetters(['nightMode']),

    showEmptyState() {
      return this.loaded && !Object.keys(this.notes).length;
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
.note {
  img {
    align-self: baseline;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss">
img, pre {
  max-width: 100%;
}
</style>
