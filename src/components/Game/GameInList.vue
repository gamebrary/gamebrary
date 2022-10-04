<template lang="html">
  <div v-if="boardsWithGame.length" class="mt-4">
    <p class="small mb-2">Found in</p>

    <b-button
      v-for="board in boardsWithGame"
      :to="{ name: 'board', params: { id: board.id } }"
      :key="board.id"
      variant="light"
      size="sm"
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
      return this.boards
        ?.filter(({ lists }) => lists.some(({ games }) => games.includes(this.game.id))) || [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
