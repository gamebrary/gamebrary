<template lang="html">
  <game-page-tile
    v-if="user && boardsWithGame.length"
    title="Found in these boards"
    full
  >
    <div class="board-grid">
      <mini-board
        v-for="board in boardsWithGame"
        :key="board.id"
        :board="board"
        @click.native="handleBoardClick(board.id)"
      />
    </div>
  </game-page-tile>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import GamePageTile from '@/components/Game/GamePageTile';
import { mapState } from 'vuex';

export default {
  components: {
    MiniBoard,
    GamePageTile,
  },

  computed: {
    ...mapState(['game', 'boards', 'user']),

    boardsWithGame() {
      return this.boards?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(this.game?.id))) || [];
    },
  },

  methods: {
    handleBoardClick(boardId) {
      this.$store.commit('SET_HIGHLIGHTED_GAME', this.game.id)
      this.$router.push({ name: 'board', params: { id: boardId } });
    },
  },
};
</script>
