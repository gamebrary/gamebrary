<template lang="html">
  <div v-if="loading" class="spinner-centered d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="company">
    <portal to="pageTitle">
      <h3>{{ company.name }}</h3>
    </portal>

    <img :src="getImageUrl(company)" :alt="company.name" width="240" class="mb-2" />
    <h3 class="mb-1">{{ company.name }}</h3>

    <p>{{ company.description }}</p>

    <div v-if="hasGames" class="mt-4">
      <ul class="nav nav-tabs" role="tablist">
        <li v-if="company.developed?.length" class="nav-item" role="presentation">
          <button class="nav-link" :class="{ 'active': activeTab === 'developed' }" id="developed-tab"
            data-bs-toggle="tab" data-bs-target="#developed-pane" type="button" role="tab"
            @click="activeTab = 'developed'">
            Developed
            <span class="badge ms-2" :class="darkTheme ? 'bg-light text-dark' : 'bg-dark text-light'">
              {{ company.developed?.length || 0 }}
            </span>
          </button>
        </li>
        <li v-if="company.published?.length" class="nav-item" role="presentation">
          <button class="nav-link" :class="{ 'active': activeTab === 'published' }" id="published-tab"
            data-bs-toggle="tab" data-bs-target="#published-pane" type="button" role="tab"
            @click="activeTab = 'published'">
            Published
            <span class="badge ms-2" :class="darkTheme ? 'bg-light text-dark' : 'bg-dark text-light'">
              {{ company.published?.length || 0 }}
            </span>
          </button>
        </li>
      </ul>

      <div class="tab-content mt-3">
        <div v-if="company.developed?.length" class="tab-pane fade"
          :class="{ 'show active': activeTab === 'developed' }" id="developed-pane" role="tabpanel">
          <div class="game-grid">
            <GameCard v-for="gameDeveloped in company.developed" :game-id="gameDeveloped.id" :key="gameDeveloped.id"
              hide-platforms vertical hide-tags hide-progress class="mb-3" />
          </div>
        </div>

        <div v-if="company.published?.length" class="tab-pane fade"
          :class="{ 'show active': activeTab === 'published' }" id="published-pane" role="tabpanel">
          <div class="game-grid">
            <GameCard v-for="gamePublished in company.published" :game-id="gamePublished.id" :key="gamePublished.id"
              hide-platforms vertical hide-tags hide-progress class="mb-3" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    empty
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import { getImageUrl } from '@/utils';
import { IGDB_QUERIES } from '@/constants';
import GameCard from '@/components/GameCard';

const route = useRoute();
const gamesStore = useGamesStore();
const twitchStore = useTwitchStore();
const { darkTheme } = useAppGetters();

const loading = ref(false);
const company = ref(null);
const activeTab = ref('developed');

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

  // Set initial active tab based on available games
  if (company.value?.developed?.length && !company.value?.published?.length) {
    activeTab.value = 'developed';
  } else if (company.value?.published?.length && !company.value?.developed?.length) {
    activeTab.value = 'published';
  } else if (company.value?.published?.length) {
    activeTab.value = 'published';
  } else {
    activeTab.value = 'developed';
  }

  loading.value = false;
});

// Computed properties
const hasGames = computed(() => {
  return (company.value?.developed?.length > 0) || (company.value?.published?.length > 0);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
