<template lang="html">
  <div>
    <GameCard
      v-for="game in upcomingGames"
      :game-id="game.id"
      :key="game.id"
      @click.native="$router.push({ name: 'game', params: { id: game.game.id, slug: game.game.slug } })"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useTwitchStore } from '@/stores/twitch';
import GameCard from '@/components/GameCard';

const gamesStore = useGamesStore();
const twitchStore = useTwitchStore();

const upcomingGames = ref([]);

const load = async () => {
  if (!twitchStore.twitchToken) {
    await twitchStore.getTwitchToken();
  }
  const data = await gamesStore.queryIGDB({
    path: 'release_dates',
    data: `fields *, game.category, game.name, game.cover.*; where game.category = 0; sort date desc; limit: 100;`,
  });

  upcomingGames.value = data.map(({ game }) => game);

  if (upcomingGames.value?.length) {
    gamesStore.cacheGameData(upcomingGames.value);
  }
};

onMounted(() => {
  load();
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
