<template lang="html">
  <b-dropdown-item
    :variant="gameInList ? 'danger' : 'success'"
    @click="handleClick"
  >
    <i :class="`fas fa-${gameInList ? 'trash-alt' : 'plus'} fa-fw`" aria-hidden />
    {{ label }}
  </b-dropdown-item>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    game: Object,
    list: Object,
  },

  computed: {
    ...mapState(['board']),

    gameInList() {
      return this.game && this.list.games.includes(this.game.id);
    },

    label() {
      return this.gameInList
        ? this.$t('board.gameModal.removeFromList')
        : this.$t('board.list.addGame');
    },
  },

  methods: {
    handleClick() {
      if (this.gameInList) {
        this.removeGame();
      } else {
        this.addGame();
      }
    },

    async addGame() {
      const { list, game, board } = this;

      const listIndex = board.lists.findIndex(({ name }) => name === list.name);

      this.$store.commit('ADD_GAME_TO_LIST', {
        listIndex,
        game,
      });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
        });

      // TODO: CUSTOMIZE TO SHOW GAME COVER
      this.$bvToast.toast(`${this.game.name} added`, { title: list.name, variant: 'success' });

      // this.$ga.event({
      //   eventCategory: 'game',
      //   eventAction: 'add',
      //   eventLabel: 'addGame',
      //   eventValue: data,
      // });
    },

    async removeGame() {
      const { list, game, board } = this;

      const listIndex = board.lists.findIndex(({ name }) => name === list.name);

      this.$store.commit('REMOVE_GAME_FROM_LIST', { listIndex, game });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
        });

      this.$bvToast.toast(`${this.game.name} removed`, { title: list.name, variant: 'success' });
    },
  },
};
</script>
