<template>
  <div class="tab-pane fade show active">
    <section v-if="highlightedAchievements && highlightedAchievements.length">
      <h3 class="mb-2">Achievements</h3>

      <ul class="list-group">
        <li class="list-group-item d-flex align-items-center" :class="darkTheme ? 'bg-dark text-light' : 'bg-white'"
          v-for="achievement in highlightedAchievements" :key="achievement.name">
          <img :src="achievement.path" alt="" class="me-2" style="width: 40px; height: 40px; object-fit: cover;" />

          <h3>{{ achievement.name }}</h3>
        </li>
      </ul>
    </section>

    <EmptyState v-else title="No achievements available" message="Achievements are not available for this game." />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useAppGetters } from '@/stores/getters';
import EmptyState from '@/components/EmptyState';

const gamesStore = useGamesStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);
const highlightedAchievements = computed(() => game.value?.steam?.achievements?.highlighted);
</script>




