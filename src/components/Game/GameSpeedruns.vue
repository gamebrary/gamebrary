<template lang="html">
  <div class="card">
    <div class="card-body">
      <h4>Speedruns</h4>

      <pre>{{ speedruns }}</pre>

      <div v-for="(speedrun, index) in speedruns" :key="index" class="mb-3">
        <div class="ratio ratio-16x9">
          <iframe
            :src="speedrun.videoUrl"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGamesStore } from '@/stores/games';

const gamesStore = useGamesStore();

// Reactive state
const loaded = ref(false);

// Store state and getters
const game = computed(() => gamesStore.game);

// Computed properties
const speedruns = computed(() => {
  return game.value?.speedruns
    ?.map((speedrun) => speedrun?.videos?.links?.[0]?.uri)
    ?.filter((url) => url?.includes('youtube'))
    ?.map((youtubeUrl) => {
      const youtubeId = youtubeUrl?.split('v=')?.[1];

      return {
        imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`,
      };
    });
});

// Methods
const loadSpeedruns = async () => {
  try {
    await gamesStore.getSpeedrunGameId(game.value.name);
    loaded.value = true;
  } catch (error) {
    console.error('Error loading speedruns:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  loadSpeedruns();
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
