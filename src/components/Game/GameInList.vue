<template lang="html">
  <div class="mt-4">
    <b-button
      v-for="board in boardsWithGame"
      :key="board.id"
      :to="{ name: 'board', params: { id: board.id } }"
      variant="outline-primary"
      class="mr-2 py-0 mb-2"
    >
      <small>{{ board.name }}</small>
    </b-button>

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
