<template lang="html">
  <div v-if="boardsWithGame.length">
    <small>Found in:</small>

    <router-link
      v-for="(board, index) in boardsWithGame"
      :to="{ name: 'board', params: { id: board.id } }"
      :key="board.id"
      variant="link"
      class="small"
    >
      {{ board.name }}{{ boardsWithGame.length - 1 === index ? '' : ',' }}
    </router-link>
  </div>
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
