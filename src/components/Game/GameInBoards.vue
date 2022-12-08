<template lang="html">
  <div v-if="user && boardsWithGame.length">
    <h4 :class="['mb-3', { 'text-outlined': hasWallpaper }]">Found in these boards: </h4>

    <!-- TODO: highlight game when linking back to board -->
    <mini-board
      v-for="board in boardsWithGame"
      :key="board.id"
      :board="board"
      class="mb-3"
      @click.native="$router.push({ name: 'board', params: { id: board.id } })"
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
