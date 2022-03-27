<template lang="html">
  <!-- no-body -->
  <b-card
    :title="game.name"
    title-tag="span"
    body-class="p-2"
    :img-src="coverUrl"
    class="game-card"
  >
  <!-- <b-card


    img-alt="Image"
    img-top
  >
    <b-card-text>
      This is a wider card with supporting text below as a natural lead-in to additional content.
      This content is a little bit longer.
    </b-card-text>
  </b-card> -->
    <!-- <b-row no-gutters v-if="game && game.name">
      <b-col cols="2">
        <b-card-img
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="10">
        <b-card-body body-class="p-2">
          <b-card-title class="mb-2" title-tag="h6">
            {{ game.name }}
          </b-card-title>
        </b-card-body>
      </b-col>
    </b-row> -->
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],

  methods: {
    async addGame() {
      const { list, game, board } = this;

      if (!list) return;

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
          h('b-img', {
            props: {
              src: this.coverUrl,
              alt: this.game.name,
              width: 80,
            },
          }),
          h('small', `${this.game.name} added`),
        ],
      );

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
  grid-gap: .5rem;
}

.game-card {
  cursor: pointer;
}
</style>

