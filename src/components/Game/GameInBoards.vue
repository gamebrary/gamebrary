<template lang="html">
  <div v-if="user && boardsWithGame.length" class="mt-5">
    <h3>Found in these boards: </h3>

    <div class="board-grid">
      <mini-board
        v-for="board in boardsWithGame"
        :key="board.id"
        :board="board"
        @click.native="handleBoardClick(board.id)"
      />
    </div>
  </div>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState } from 'vuex';

export default {
  components: {
    MiniBoard,
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
