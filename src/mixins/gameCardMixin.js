import { mapState, mapGetters } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  getGameCoverUrl,

  props: {
    list: {
      type: Object,
      default: () => {},
    },
    gameId: [String, Number],
  },

  computed: {
    ...mapState(['settings', 'games', 'tags', 'notes', 'progresses', 'board']),
    ...mapGetters(['isRTL', 'darkTheme']),

    highlightCompletedGame() {
      return this.gameProgress && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.gameProgress > 0;
    },

    showReleaseDates() {
      return this.list?.showReleaseDates;
    },

    gameProgress() {
      const { gameId, progresses } = this;

      return gameId && progresses[gameId]
        ? progresses[gameId]
        : 0;
    },

    tagsApplied() {
      const tags = this.tags?.tags || this.tags;

      return tags?.filter((tag) => tag?.games?.includes(this.game?.id)) || [];
    },

    gameNotes() {
      return this.list?.showGameNotes && this.notes?.[this.gameId];
    },

    game() {
      return this.games[this.gameId];
    },
  },
};
