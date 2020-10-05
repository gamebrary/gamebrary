<template lang="html">
  <b-card no-body class="game-card mb-1">
    <b-row no-gutters v-if="game && game.name">
      <b-col cols="3">
        <b-card-img
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="9">
        <b-card-body body-class="p-2">
          <b-card-title class="mb-2" title-tag="h6">
            {{ game.name }}
          </b-card-title>

          <b-button
            @click="addGame"
            variant="primary"
          >
            {{ $t('board.list.addGame') }}
          </b-button>

          <b-form-rating
            v-if="gameRating"
            class="p-0 border-0 shadow-none"
            inline
            :value="gameRating"
            readonly
            variant="warning"
            size="sm"
            no-border
          />
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],

  methods: {
    async addGame() {
      const { list, game, board } = this;

      const listIndex = board.lists.findIndex(({ name }) => name === list.name);

      this.$store.commit('ADD_GAME_TO_LIST', { listIndex, game });
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast(`There was an error adding ${this.game.name}`, { title: list.name, variant: 'danger' });
        });

      this.showGameToast();
    },

    showGameToast() {
      const h = this.$createElement;

      const vNodesMsg = h(
        'div', { class: 'image-toast' }, [
          h('b-card-img', {
            class: 'toast-image',
            props: {
              src: this.coverUrl,
              alt: this.game.name,
              width: 80,
            },
          }),
          h('p', `${this.game.name} added`),
        ],
      );
      // Pass the VNodes as an array for message and title
      this.$bvToast.toast([vNodesMsg], {
        title: this.list.name,
        solid: true,
        variant: 'info',
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.image-toast {
  display: grid;
    grid-gap: 1rem;
    grid-template-columns: 80px auto;
}

.toast-image {
  width: 80px !important;
}
</style>

