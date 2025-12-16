<template>
  <div class="tab-pane fade show active">
    <section v-if="latestNews && latestNews.length">
      <h3 class="mb-2">Latest news</h3>

      <ul class="list-group">
        <li v-for="article in latestNews" :key="article.id" class="list-group-item list-group-item-action"
          :class="darkTheme ? 'bg-dark text-light' : 'bg-white'"
          @click="$router.push({ name: 'game.news.full', params: { id: game?.id, slug: game?.slug } })" style="cursor: pointer;">
          <div class="d-flex w-100 justify-content-between">
            <h4 class="mb-1">{{ article.title }}</h4>
            {{ article.date }}
          </div>

          <small v-if="article.author">By {{ article.author }}</small>

          from

          <a v-if="article.source.url" :href="article.source.url" :title="article.source.name" target="blank"
            class="mb-2 ml-2">
            <img width="20" :src="`/logos/news-sources/${article.source.img}`" alt="" />
          </a>

          <br />

          <span v-for="tag in article.tags" :key="tag" class="badge bg-secondary me-1">{{ tag }}</span>
        </li>
      </ul>
    </section>

    <EmptyState v-else title="No news available" message="News articles are not available for this game." />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useAppGetters, useGameGetters } from '@/stores/getters';
import EmptyState from '@/components/EmptyState';

const router = useRouter();
const gamesStore = useGamesStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);
const gameGetters = computed(() => game.value ? useGameGetters(game.value) : null);
const gameNews = computed(() => gameGetters.value?.gameNews || []);

const latestNews = computed(() => {
  if (!Array.isArray(gameNews.value)) return [];
  return gameNews.value.slice(0, 10);
});
</script>

