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

    gameProgress() {
      return this.game
        && this.platform
        && this.progresses[this.platform.code]
        && this.progresses[this.platform.code][this.game.id];
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

