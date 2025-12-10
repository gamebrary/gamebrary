<template>
  <div>
    <div
      class="d-flex mx-2"
      v-for="tier in board.lists"
      style="margin-bottom: 4px;"
      :key="tier.id"
    >
      <div
        :style="`background-color: ${tier.backgroundColor}; border-radius: 4px !important; width: 20px; height: 20px;`"
      />

      <img
        v-for="(game, index) in tier.games"
        :key="index"
        :ref="el => { if (el) gameRefs[`tier-${tier.id}-game-${index}`] = el }"
        :class="[
          currentGameId === game.id ? 'border border-danger' : null,
          getGameVariant(game) === 'black' ? 'bg-black' : getGameVariant(game) === 'secondary' ? 'bg-secondary' : getGameVariant(game) === 'success' ? 'bg-success' : 'bg-danger'
        ]"
        :title="game.name"
        :src="showGameThumbnails && game.src ? game.src : null"
        :alt="game.name"
        style="margin-left: 4px; border-radius: 4px !important; width: 20px; height: 20px; object-fit: cover;"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  gameId: Number,
});

const route = useRoute();
const gamesStore = useGamesStore();
const uiStore = useUIStore();
const { darkTheme, showGameThumbnails } = useAppGetters();

// Template refs
const gameRefs = ref({});

// Store state and getters
const routeName = computed(() => uiStore.routeName);
const game = computed(() => gamesStore.game);

// Computed properties
const currentGameId = computed(() => {
  return routeName.value === 'game'
    ? game.value?.id
    : null;
});

// Methods
const getGameVariant = (gameItem) => {
  const defaultVariant = darkTheme.value ? 'black' : 'secondary';

  if (!gameItem?.id) return defaultVariant;
  if (game.value?.id === props.gameId) return darkTheme.value ? 'success' : 'danger';

  return defaultVariant;
};

const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

// Lifecycle hooks
onMounted(() => {
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});
</script>

<style scoped>
/* Your component styles here */
</style>
