// import moment from 'moment';
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
    // Remove unused stuff
    ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags', 'activeList', 'notes', 'progresses', 'board']),
    // TODO: remove getter
    ...mapGetters(['gameTags']),

    showGameTags() {
      const { settings } = this.list;

      return settings && settings.showGameTags && this.gameTags;
    },

    gameRating() {
      const { settings } = this.list;

      return settings && settings.showGameRatings && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },

    gameProgress() {
      const { gameId, progresses, list: { settings } } = this;

      return settings && settings.showGameProgress && gameId && progresses[gameId]
        ? progresses[gameId]
        : null;
    },

    gameNotes() {
      const { settings } = this.list;

      return settings && settings.showGameNotes && this.notes[this.gameId];
    },

    game() {
      return this.games[this.gameId];
    },

    coverUrl() {
      const game = this.games[this.gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },

    addToLabel() {
      return this.list.name.length >= 25
        ? 'list'
        : this.list.name;
    },
  },

  methods: {
    openDetails() {
      const { gameId, list } = this;

      this.$store.commit('SET_GAME_MODAL_DATA', { gameId, list });
      this.$bvModal.show('game-modal');
    },

    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameId });
      this.saveTags();
    },

    async saveTags() {
      await this.$store.dispatch('SAVE_TAGS_LEGACY', this.tags)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('Tags updated', { title: 'Success', variant: 'success' });
    },
  },
};
