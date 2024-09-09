<template lang="html">
  <div v-if="user && boardsWithGame.length">
    <h4 class="mb-2">Found in {{ boardsWithGame.length }} boards</h4>

    <MiniBoard
      v-for="board in boardsWithGame"
      :key="board.id"
      :board="board"
      class="mb-3"
      no-link
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
