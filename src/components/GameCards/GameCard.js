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
    ...mapGetters(['gameTags']),

    showGameTags() {
      return this.list.showGameTags && this.gameTags;
    },

    gameRating() {
      return this.list.showGameRatings && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },

    gameProgress() {
      const { game, platform, progresses, list } = this;

      return game
        && list.showGameProgress
        && platform
        && progresses[platform.code]
        && progresses[platform.code][game.id];
    },

    releaseDate() {
      const releaseDate = this.game
        && this.list.showReleaseDates
        && this.game.release_dates
        && this.game.release_dates.find(({ platform }) => this.platform.id === platform);

      const formattedDate = releaseDate && releaseDate.date
        ? moment.unix(releaseDate.date)
        : null;

      return moment(formattedDate).isAfter()
        ? formattedDate.toNow(true)
        : null;
    },

    gameCardClass() {
      return [
        'game-card',
        this.list.view,
      ];
    },

    activePlatform() {
      return this.gameLists[this.platform.code];
    },

    gameNotes() {
      return this.list.showGameNotes
        && this.notes
        && this.notes[this.gameId]
        && this.notes[this.gameId].text;
    },

    list() {
      return this.activePlatform[this.listId] || {};
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
      const { gameId, listId } = this;

      this.$store.commit('SET_GAME_MODAL_DATA', { gameId, listId });
      this.$bvModal.show('game-modal');
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
          // TODO: customize, show cover url
          this.$bvToast.toast(`Added ${this.game.name} to list ${this.list.name}`, { title: 'Game added', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
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
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('Tags updated', { title: 'Success', variant: 'success' });
    },
  },
};
