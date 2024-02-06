<template lang="html">
  <div
    v-if="user && boardsWithGame.length"
    class="p-3 rounded"
    style="max-height: 50vh; overflow-y: auto;"
    :class="darkTheme ? 'bg-dark' : 'bg-light'"
  >
    <h4 class="mb-2">Found in {{ boardsWithGame.length }} boards</h4>
    <MiniBoard
      v-for="board in boardsWithGame"
      :key="board.id"
      :board="board"
      :gameId="game.id"
      @click.native="handleBoardClick(board.id)"
    />
  </div>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
  },

  computed: {
    ...mapState(['game', 'boards', 'user']),
    ...mapGetters(['darkTheme']),

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
