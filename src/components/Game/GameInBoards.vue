<template lang="html">
  <div v-if="user && boardsWithGame.length">
    <h4 :class="['mb-2', { 'text-outlined': hasWallpaper }]">Found in these boards: </h4>

    <mini-board
      v-for="board in boardsWithGame"
      :key="board.id"
      :board="board"
      class="mb-3"
      @click.native="$router.push({ name: 'board', params: { id: board.id }, query: { g: game.id } })"
    />

    <add-remove-game />
  </div>
</template>

<script>
import AddRemoveGame from '@/components/AddRemoveGame';
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState } from 'vuex';

export default {
  components: {
    AddRemoveGame,
    MiniBoard,
  },

  computed: {
    ...mapState(['game', 'games', 'boards', 'user']),

    boardsWithGame() {
      return this.boards?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(this.game?.id))) || [];
    },

    hasWallpaper() {
      return Boolean(this.game?.steam?.background);
    },
  },
};
</script>
