<template>
  <div class="tab-pane fade show active">
    <div class="game-stats">
      <div class="row g-4">
        <div v-if="game?.rating" class="col-12 col-md-6">
          <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
            <div class="card-body">
              <h5 class="card-title">Rating</h5>
              <div class="display-4">{{ Math.round(game.rating) }}</div>
              <small class="text-muted">out of 100</small>
            </div>
          </div>
        </div>

        <div v-if="game?.rating_count" class="col-12 col-md-6">
          <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
            <div class="card-body">
              <h5 class="card-title">Rating Count</h5>
              <div class="display-4">{{ game.rating_count.toLocaleString() }}</div>
              <small class="text-muted">ratings</small>
            </div>
          </div>
        </div>

        <div v-if="game?.popularity" class="col-12 col-md-6">
          <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
            <div class="card-body">
              <h5 class="card-title">Popularity</h5>
              <div class="display-4">{{ Math.round(game.popularity) }}</div>
            </div>
          </div>
        </div>

        <div v-if="game?.total_rating" class="col-12 col-md-6">
          <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
            <div class="card-body">
              <h5 class="card-title">Total Rating</h5>
              <div class="display-4">{{ Math.round(game.total_rating) }}</div>
              <small class="text-muted">out of 100</small>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
            <div class="card-body">
              <h5 class="card-title mb-3">Game Details</h5>
              <div class="row g-3">
                <div v-if="game?.game_modes?.length" class="col-12 col-md-6">
                  <strong>Game Modes:</strong>
                  <div class="mt-1">
                    <span v-for="mode in game.game_modes" :key="mode.id" class="badge bg-secondary me-1">
                      {{ mode.name }}
                    </span>
                  </div>
                </div>
                <div v-if="game?.themes?.length" class="col-12 col-md-6">
                  <strong>Themes:</strong>
                  <div class="mt-1">
                    <span v-for="theme in game.themes" :key="theme.id" class="badge bg-info me-1">
                      {{ theme.name }}
                    </span>
                  </div>
                </div>
                <div v-if="game?.game_engines?.length" class="col-12 col-md-6">
                  <strong>Engines:</strong>
                  <div class="mt-1">
                    <span v-for="engine in game.game_engines" :key="engine.id" class="badge bg-success me-1">
                      {{ engine.name }}
                    </span>
                  </div>
                </div>
                <div v-if="game?.age_ratings?.length" class="col-12 col-md-6">
                  <strong>Age Ratings:</strong>
                  <div class="mt-1">
                    <span v-for="rating in game.age_ratings" :key="rating.id" class="badge bg-warning me-1">
                      {{ rating.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useAppGetters } from '@/stores/getters';

const gamesStore = useGamesStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);
</script>

<style lang="scss" scoped>
.game-stats {
  .card {
    height: 100%;
  }
}
</style>
