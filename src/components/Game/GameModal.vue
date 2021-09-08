<!-- TODO: add bundles to game detail? -->
<!-- {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }} -->
<!-- <b-form-rating
  v-if="rating"
  :value="rating"
  inline
  readonly
  variant="warning"
  size="lg"
  no-border
/>

<br /> -->
<template lang="html">
  <b-modal
    id="game-modal"
    scrollable
    size="lg"
    hide-footer
    hide-header
    @show="load"
    @hidden="reset"
  >
    <div
      v-if="game.name"
    >
      <modal-header
        title="Game detail"
        :subtitle="activeGame.list ? activeGame.list.name : null"
        @close="$bvModal.hide('game-modal')"
      >
        <template v-slot:header>
          <b-img
            :src="activeGameCoverUrl"
            :alt="game.name"
            v-if="!coverVisible"
            class="float-left mr-2"
            height="40"
            rounded
          />
        </template>

        <b-dropdown right v-if="user && user.uid && user.uid === board.owner">
          <template v-slot:button-content>
            <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
          </template>

          <template v-if="standalone">
            <!-- <b-dropdown-item
              v-b-modal.tags
              v-shortkey="['t']"
              @shortkey.native="$bvModal.show('tags');"
            >
              <i class="fas fa-plus fa-fw" aria-hidden /> Add to...
            </b-dropdown-item> -->

            <!-- <b-dropdown-item
              v-b-modal.tags
              v-shortkey="['t']"
              @shortkey.native="$bvModal.show('tags');"
            >
              <i class="fas fa-plus fa-fw" aria-hidden /> Add to...
            </b-dropdown-item> -->
          </template>

          <template v-else-if="board && user.uid === board.owner">
            <game-progress :game="game" />

            <b-dropdown-item
              v-b-modal.notes
              v-shortkey="['n']"
              @shortkey.native="$bvModal.show('notes');"
            >
              <i class="far fa-sticky-note fa-fw" />
              {{ notes[game.id] ? 'Edit note' : 'Add note' }}
            </b-dropdown-item>

            <game-notes-modal :game="game" />

            <b-dropdown-item
              v-b-modal.tags
              v-shortkey="['t']"
              @shortkey.native="$bvModal.show('tags');"
            >
              <i class="far fa-tags fa-fw" /> Tags

              <game-tags-modal :game="game" />
            </b-dropdown-item>

            <b-dropdown-item-button
              v-if="!prevDisabled"
              v-shortkey="['arrowleft']"
              @shortkey.native="previousGame"
              @click="previousGame"
            >
              <i class="fas fa-caret-left fa-fw" aria-hidden /> Previous game

            </b-dropdown-item-button>

            <b-dropdown-item-button
              v-if="!nextDisabled"
              v-shortkey="['arrowright']"
              @shortkey.native="nextGame"
              @click="nextGame"
            >
              <i class="fas fa-caret-right fa-fw" aria-hidden /> Next game
            </b-dropdown-item-button>

            <add-remove-game v-if="list" :game="game" :list="list" />
          </template>
        </b-dropdown>
      </modal-header>

      <game :game="game" :loading="loading" />
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';
import Game from '@/components/Game';
import GameNotesModal from '@/components/Game/GameNotesModal';
import GameProgress from '@/components/Game/GameProgress';
import AddRemoveGame from '@/components/Game/AddRemoveGame';
import GameTagsModal from '@/components/Game/GameTagsModal';

export default {
  components: {
    Game,
    GameTagsModal,
    GameNotesModal,
    GameProgress,
    AddRemoveGame,
  },

  data() {
    return {
      gameId: null,
      coverVisible: true,
      game: {},
      loading: true,
    };
  },

  computed: {
    ...mapState(['board', 'notes', 'activeGame', 'games', 'platform', 'user', 'settings']),

    hasMultipleGames() {
      // TODO: use optional chaining
      return this.activeGame
        && this.activeGame.list
        && this.activeGame.list.games
        && this.activeGame.list.games.length > 1;
    },

    standalone() {
      return this.activeGame && !this.activeGame.list;
    },

    rating() {
      return this.game && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },

    gameIndex() {
      const { gameId, list } = this.activeGame;

      return list && list.games.indexOf(gameId);
    },

    prevDisabled() {
      return !this.activeGame.list || this.gameIndex === 0;
    },

    nextDisabled() {
      const { list } = this.activeGame;

      const isLast = this.list && list.games && this.gameIndex === list.games.length - 1;

      return !this.list || isLast;
    },
  },

  watch: {
    activeGame(value) {
      if (value) {
        this.load();
      }
    },
  },

  methods: {
    toggleCoverVisible(value) {
      this.coverVisible = value;
    },

    previousGame() {
      // TODO: account for list sorting when getting previous game
      this.loading = true;

      const { gameId, list } = this.activeGame;

      const index = list.games.indexOf(gameId);

      const prevGameId = list.games[index - 1];

      this.$store.commit('SET_GAME_MODAL_DATA', {
        gameId: prevGameId,
        list,
      });
    },

    nextGame() {
      // TODO: account for list sorting when getting next game
      this.loading = true;

      const { gameId, list } = this.activeGame;

      const index = list.games.indexOf(gameId);

      const nextGameId = list.games[index + 1];

      this.$store.commit('SET_GAME_MODAL_DATA', {
        gameId: nextGameId,
        list,
      });
    },

    load() {
      const { gameId, list } = this.activeGame;

      this.gameId = gameId;
      this.list = list;
      this.game = this.games[gameId];

      this.loadGame();
    },

    async loadGame() {
      this.loading = true;

      const { gameId } = this.activeGame;

      const game = await this.$store.dispatch('LOAD_GAME', gameId)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Error loading game', { variant: 'error' });
        });

      // avoid error when closing modal before game finishes loading
      if (!this.game) {
        return;
      }

      this.game = {
        ...this.game,
        ...game,
      };

      this.loading = false;

      // this.$ga.event({
      //   eventCategory: 'game',
      //   eventAction: 'view',
      //   eventLabel: 'gameViewed',
      //   eventValue: `${this.platform.name} - ${this.game.name}`,
      // });
    },

    reset() {
      this.gameId = null;
      this.loading = true;
      this.game = {};
    },
  },
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  .b-rating {
    line-height: normal !important;
    height: auto !important;
  }

  .sidebar {
    @media(min-width: 768px) {
      position: sticky;
      top: 0;
      align-self: baseline;
    }
  }
</style>
