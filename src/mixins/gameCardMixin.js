import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    list: {
      type: Object,
      default: () => {},
    },
    gameId: [String, Number],
  },

  computed: {
    ...mapState(['settings', 'games', 'tags', 'notes', 'progresses', 'board']),
    ...mapGetters(['isRTL']),

    highlightCompletedGame() {
      return this.gameProgress && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.gameProgress > 0;
    },

    showReleaseDates() {
      return this.list?.settings?.showReleaseDates;
    },

    gameProgress() {
      const { gameId, progresses } = this;

      return gameId && progresses[gameId]
        ? progresses[gameId]
        : 0;
    },

    tagsApplied() {
      return this.tags?.filter((tag) => tag?.games?.includes(this.game?.id))
    },

    gameNotes() {
      const { settings } = this.list;

      return settings?.showGameNotes && this.notes[this.gameId];
    },

    game() {
      return this.games[this.gameId];
    },

    coverUrl() {
      const game = this.games[this.gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },
  },
};
