<template lang="html">
  <b-sidebar
    :id="gameDetailView === 'side' ? 'game-sidebar' : ''"
    right
    backdrop
    @shown="load"
    @hidden="reset"
  >
    <!-- TODO: restrict usage of sidebar when setting is set -->
    <game :game="game" :loading="loading" />
  </b-sidebar>
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

    gameDetailView() {
      return this.settings && this.settings.gameDetailView;
    },

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

