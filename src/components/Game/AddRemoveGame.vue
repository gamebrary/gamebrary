<template lang="html">
  <b-button
    v-if="game && !list.games.includes(game.id)"
    :title="$t('board.list.addGame')"
    variant="success"
    v-b-tooltip.hover
    @click="addGame"
  >
    <i class="fas fa-plus fa-fw" aria-hidden />
  </b-button>

  <b-button
    v-else
    variant="danger"
    v-b-tooltip.hover
    :title="$t('board.gameModal.removeFromList')"
    @click="removeGame"
  >
    <i class="fas fa-trash-alt fa-fw" aria-hidden />
  </b-button>
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
  },

  methods: {
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
