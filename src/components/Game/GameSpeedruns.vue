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
import { useStore } from 'vuex';

const store = useStore();

// Reactive state
const loaded = ref(false);

// Store state and getters
const game = computed(() => store.state.game);

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
  const speedRunGame = await store.dispatch('GET_SPEEDRUN_GAME_ID', game.value.name);

  const gameData = speedRunGame?.data?.[0];
  const runsLink = gameData.links.find(({ rel }) => rel === 'runs')?.uri;

  await store.dispatch('LOAD_GAME_SPEEDRUN_RUNS', runsLink);

  loaded.value = true;
};

// Lifecycle hooks
onMounted(() => {
  loadSpeedruns();
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
