<template lang="html">
  <!-- TODO: add menu: allow to remove game from board, view board, edit board, etc... -->
  <div v-if="user && boardsWithGame.length" class="mt-5">
    <h3>Found in these boards: </h3>

    <div class="board-grid">
      <b-dropdown
        v-for="board in boardsWithGame"
        :key="board.id"
        variant="transparent"
        toggle-class="p-0"
        no-caret
      >
        <template #button-content>
          <mini-board
            :board="board"
          />
        </template>
        <b-dropdown-item disabled>Remove game from board</b-dropdown-item>
        <b-dropdown-item :to="{ name: 'board.edit', params: { id: board.id } }">Edit board</b-dropdown-item>
        <b-dropdown-item @click="handleBoardClick(board.id)">View board</b-dropdown-item>
      </b-dropdown>
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
