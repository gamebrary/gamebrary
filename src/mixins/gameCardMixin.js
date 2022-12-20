import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

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

    cardBackgroundVariant() {
      if (this.gameCompleted) return 'success';

      return this.darkTheme ? 'dark' : 'white';
    },

    cardTextVariant() {
      if (this.gameCompleted) return 'white';

      return this.darkTheme ? 'white' : 'dark';
    },

    gameCompleted() {
      return this.list?.highlightCompletedGames && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.list?.showGameProgress && this.gameProgress > 0;
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
