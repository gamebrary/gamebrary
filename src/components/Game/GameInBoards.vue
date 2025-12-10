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
import { useGamesStore } from '@/stores/games';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import MiniBoard from '@/components/Board/MiniBoard';

const router = useRouter();
const gamesStore = useGamesStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const { darkTheme } = useAppGetters();

// Store state and getters
const game = computed(() => gamesStore.game);
const boards = computed(() => boardsStore.boards);
const user = computed(() => userStore.user);

// Computed properties
const boardsWithGame = computed(() => {
  return boards.value?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(game.value?.id))) || [];
});

// Methods
const handleBoardClick = (boardId) => {
  uiStore.setHighlightedGame(game.value.id);
  router.push({ name: 'board', params: { id: boardId } });
};
</script>
