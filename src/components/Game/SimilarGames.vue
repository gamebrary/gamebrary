<template>
  <div v-if="allGames.length">
    <h2 class="pb-3">You may also like</h2>

    <div class="scroll-container pb-3">
      <GameCard
        v-for="game in allGames"
        :key="game && game.id"
        :game-id="game.id"
        hide-platforms
        vertical
        hide-tags
        hide-title
        hide-progress
        class="scroll-item mr-3"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import GameCard from '@/components/GameCard';

const store = useStore();

// Store state and getters
const game = computed(() => store.state.game);

// Computed properties
const gameRemakes = computed(() => {
  return game.value?.remakes || [];
});

const collectionGames = computed(() => {
  const filteredGames = game.value?.collection?.games?.filter(({ id }) => {
    const isCurrentGame = id === game.value?.id;
    return !isCurrentGame;
  });

  return filteredGames || [];
});

const gamePorts = computed(() => {
  return game.value?.ports || [];
});

const gameRemasters = computed(() => {
  return game.value?.remasters || [];
});

const similarGames = computed(() => {
  return game.value?.similar_games || [];
});

const gameBundles = computed(() => {
  return game.value?.bundles || [];
});

const parentGame = computed(() => {
  return game.value?.parent_game
    ? [game.value?.parent_game]
    : [];
});

const allGames = computed(() => {
  const allGamesList = [
    ...parentGame.value,
    ...gameRemakes.value,
    ...collectionGames.value,
    ...gamePorts.value,
    ...gameRemasters.value,
    ...gameBundles.value,
    ...similarGames.value,
  ];

  return allGamesList.filter((obj, index) => (index === allGamesList.findIndex(o => obj.id === o.id)));
});

// Watchers
watch(allGames, (games) => {
  if (games?.length) store.commit('CACHE_GAME_DATA', games);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .scroll-container {
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
    }

    .scroll-item {
      display: inline-block;
    }

</style>