<template lang="html">
  <div v-if="user && boardsWithGame.length">
    <h3 class="mb-2">Found in {{ boardsWithGame.length }} boards</h3>

    <MiniBoard
      v-for="board in boardsWithGame"
      :key="board.id"
      :board="board"
      class="mb-3"
      no-link
          @click="handleBoardClick(board.id)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';

const router = useRouter();
const store = useStore();

// Store state and getters
const game = computed(() => store.state.game);
const boards = computed(() => store.state.boards);
const user = computed(() => store.state.user);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const boardsWithGame = computed(() => {
  return boards.value?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(game.value?.id))) || [];
});

// Methods
const handleBoardClick = (boardId) => {
  store.commit('SET_HIGHLIGHTED_GAME', game.value.id);
  router.push({ name: 'board', params: { id: boardId } });
};
</script>
