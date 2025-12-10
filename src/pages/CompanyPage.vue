<template lang="html">
  <section>
    <div class="container">
      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="company">
        <portal to="pageTitle">
          <h3>{{ company.name }}</h3>
        </portal>

        <img
          :src="getImageUrl(company)"
          :alt="company.name"
          width="100"
          class="mb-2"
        />

        <p>{{ company.description }}</p>

        <h3 class="w-100 my-3">Games developed by {{ company.name }}</h3>

        <div class="game-grid">
          <GameCard
            v-for="gameDeveloped in company.developed"
            :game-id="gameDeveloped.id"
            :key="gameDeveloped.id"
            hide-platforms
            vertical
            hide-tags
            hide-progress
            class="mb-3"
          />
        </div>

        <div v-if="company.published">
          <h3 class="w-100 my-3">Games published by {{ company.name }}</h3>


          <div class="game-grid">
            <GameCard
              v-for="gamePublished in company.published"
              :game-id="gamePublished.id"
              :key="gamePublished.id"
              hide-platforms
              vertical
              hide-tags
              hide-progress
              class="mb-3"
            />
          </div>
        </div>
      </div>

      <div v-else>
        empty
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useTwitchStore } from '@/stores/twitch';
import { getImageUrl } from '@/utils';
import { IGDB_QUERIES } from '@/constants';
import GameCard from '@/components/GameCard';

const route = useRoute();
const gamesStore = useGamesStore();
const twitchStore = useTwitchStore();

const loading = ref(false);
const company = ref(null);

onMounted(async () => {
  loading.value = true;

  if (!twitchStore.twitchToken) {
    await twitchStore.getTwitchToken();
  }

  const results = await gamesStore.queryIGDB({
    path: 'companies',
    data: `${IGDB_QUERIES.COMPANY} where id = ${route.params.id};`,
  });

  [company.value] = results;

  const allGames = [
    ...company.value?.published || [],
    ...company.value?.developed || [],
  ];

  if (allGames?.length) {
    gamesStore.cacheGameData(allGames);
  }

  loading.value = false;
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
