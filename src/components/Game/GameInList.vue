<template lang="html">
  <div>
    <strong class="text-muted">Found in</strong>

    <br />

    <b-link
      v-for="(board, index) in boardsWithGame"
      :key="board.id"
      :to="{ name: 'board', params: { id: board.id } }"
    >
      {{ board.name }}
      <template v-if="index !== boardsWithGame.length - 1">,</template>
    </b-link>

    <add-remove-game />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AddRemoveGame from '@/components/AddRemoveGame';

export default {
  components: {
    AddRemoveGame,
  },

  computed: {
    ...mapState(['board', 'game', 'boards']),

    boardsWithGame() {
      const filteredBoards = this.boards?.filter(({ lists }) => lists.some(({ games }) => games.includes(this.game.id))) || [];

      return filteredBoards;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
