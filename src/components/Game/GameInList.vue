<template lang="html">
  <b-card
    v-if="boardsWithGame.length"
    class="mt-2 ml-auto mr-auto text-center"
    body-class="p-2"
  >
    <p class="mb-2 text-muted small">Found in:</p>

    <b-button
      v-for="board in boardsWithGame"
      :to="{ name: 'board', params: { id: board.id } }"
      :key="board.id"
      variant="link"
      size="sm"
    >
      {{ board.name }}
    </b-button>
  </b-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'game', 'boards']),

    boardsWithGame() {
      return this.boards
        ?.filter(({ lists }) => lists.some(({ games }) => games.includes(this.game.id))) || [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
