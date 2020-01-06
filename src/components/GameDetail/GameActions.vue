<template lang="html">
  <div class="game-actions">
    <game-progress-modal />
    <game-notes />

    <div v-if="hasTags" class="tags">
      <button
        class="primary"
        :title="$t('tags.addTag')"
        @click="openTags"
      >
        <i class="fas fa-tag" />
      </button>
    </div>

    <button
      v-if="game && !list.games.includes(game.id)"
      class="primary"
      :title="$t('list.addGame')"
      @click="addGame"
    >
      <i class="fas fa-plus" />
    </button>

    <button
      v-else
      class="danger"
      :title="$t('gameDetail.removeFromList')"
      @click="removeGame"
    >
      <i class="far fa-trash-alt" />
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameNotes from '@/components/GameDetail/GameNotes';
import GameProgressModal from '@/components/GameDetail/GameProgressModal';

export default {
  components: {
    GameNotes,
    GameProgressModal,
  },

  props: {
    listId: {
      type: [Number, String],
      default: null,
    },
  },

  computed: {
    ...mapState(['gameLists', 'platform', 'game']),
    ...mapGetters(['hasTags']),

    // TODO: create getter for activeList
    activePlatform() {
      return this.gameLists[this.platform.code];
    },

    list() {
      return this.activePlatform[this.listId];
    },
  },

  methods: {
    openTags() {
      this.$bus.$emit('OPEN_TAGS', this.game.id);
    },

    removeGame() {
      const data = {
        listId: this.listId,
        gameId: this.game.id,
      };

      this.$store.commit('REMOVE_GAME', data);

      this.$store
        .dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', {
            message: `Removed ${this.game.name} from list ${this.list.name}`,
            imageUrl: this.coverUrl,
          });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    addGame() {
      const data = {
        listId: this.listId,
        gameId: this.game.id,
      };

      // this.$emit('added');
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '~styles/styles';

.game-actions {
  display: grid;
  grid-template-columns: repeat(4, 44px);
  grid-gap: $gp / 2;
  margin-top: $gp;
  text-align: left;

  @media($small) {
    justify-content: center;
  }
}
</style>
