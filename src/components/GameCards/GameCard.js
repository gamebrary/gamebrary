import moment from 'moment';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    gameId: Number,
    listId: Number,
  },

  data() {
    return {
      showEditOptions: false,
    };
  },

  computed: {
    ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags', 'activeList', 'notes', 'progresses']),
    ...mapGetters(['hasTags']),

    showGameRatings() {
      return this.game.rating && this.list && !this.list.hideGameRatings;
    },

    showReleaseDates() {
      return this.releaseDate && this.list && !this.list.hideReleaseDates;
    },

    showGameInfo() {
      return this.list && !this.list.hideGameInfo;
    },

    showGameInfoOnCover() {
      return this.list && !this.list.hideGameInfoOnCover;
    },

    gameProgress() {
      return this.game
        && this.platform
        && this.progresses[this.platform.code]
        && this.progresses[this.platform.code][this.game.id];
    },

    releaseDate() {
      const releaseDate = this.game
        && this.game.release_dates
        && this.game.release_dates.find(
          ({ platform }) => this.platform.id === platform,
        );

      let daysUntilRelease = releaseDate.date
        ? Math.ceil(moment.unix(releaseDate.date).diff(moment(), 'days', true))
        : this.$t('releaseDates.ToBeAnnounced');

      daysUntilRelease = daysUntilRelease < 0
        ? ''
        : daysUntilRelease;

      daysUntilRelease = daysUntilRelease >= 0 && daysUntilRelease === 0
        ? this.$t('releaseDates.Today')
        : daysUntilRelease;

      return daysUntilRelease;
    },

    releaseDateText() {
      if (this.releaseDate >= 1) {
        return this.releaseDate === 1
          ? this.$t('releaseDates.ReleasesTomorrow')
          : this.$t('releaseDates.ReleasesInXDays', { days: this.releaseDate });
      } else if (this.releaseDate === this.$t('releaseDates.Today')) {
        return new Date().getHours() < 15
          ? this.$t('releaseDates.ReleasesToday')
          : this.$t('releaseDates.ReleasedToday');
      }

      return this.releaseDate;
    },

    gameCardClass() {
      const badge = this.showGameInfoOnCover && this.gameProgress === '100'
        ? 'badge'
        : '';

      return [
        'game-card',
        this.list.view,
        badge,
      ];
    },

    activePlatform() {
      return this.gameLists[this.platform.code];
    },

    note() {
      return this.notes && this.notes[this.gameId] && this.notes[this.gameId].text;
    },

    progress() {
      return this.progresses && this.progresses[this.gameId] && this.progresses[this.gameId].number;
    },

    list() {
      return this.activePlatform[this.listId];
    },

    game() {
      return this.games[this.gameId];
    },

    coverUrl() {
      const game = this.games[this.gameId];

      return game.cover && game.cover.image_id
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
      this.$bus.$emit('OPEN_GAME', {
        id: this.game.id,
        listId: this.listId,
      });
    },

    openTags() {
      this.$bus.$emit('OPEN_TAGS', this.game.id);
    },

    addGame() {
      const data = {
        listId: this.listId,
        gameId: this.gameId,
      };

      this.$emit('added');
      this.$store.commit('ADD_GAME', data);

      this.$ga.event({
        eventCategory: 'game',
        eventAction: 'add',
        eventLabel: 'addGame',
        eventValue: data,
      });

      this.$store.dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', {
            message: `Added ${this.game.name} to list ${this.list.name}`,
            imageUrl: this.coverUrl,
          });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameId });
      this.saveTags();
    },

    async saveTags() {
      await this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your tag', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'Tags updated' });
    },
  },
};
