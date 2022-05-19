<template lang="html">
  <!-- no-body -->
  <b-card
    :title="game.name"
    title-tag="span"
    body-class="p-2"
    :img-src="coverUrl"
    class="game-card"
  >
    <b-button @click.stop="addGameToList" variant="primary" block>
      <i class="fa fa-plus fa-fw" aria-hidden="true" />
      Add to list
    </b-button>
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],

  methods: {
    addGameToList() {
      this.$bus.$emit('ADD_GAME', this.gameId);
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

