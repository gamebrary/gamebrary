<template>
  <div class="tab-pane fade show active">
    <section class="mb-4">
      <div class="game-details-grid">
        <div v-if="user && gameProgress > 0">
          <strong>Progress:</strong> {{ gameProgress }}%
        </div>
        <div v-else-if="user">
          <strong>Progress:</strong> -
        </div>
        <div v-if="releaseYear">
          <strong>Released:</strong> {{ releaseYear }}
        </div>
        <div>
          <strong>Playtime:</strong> {{ playtime || '-' }}
        </div>
        <div v-if="gameGenres && gameGenres.length">
          <strong>Genres:</strong> {{ gameGenresText }}
        </div>
        <div v-if="gamePlatforms && gamePlatforms.length">
          <strong>Platforms:</strong> {{ gamePlatformsText }}
        </div>
        <div v-if="playerPerspectives && playerPerspectives.length">
          <strong>Perspective:</strong> {{ playerPerspectivesText }}
        </div>
      </div>
    </section>

    <section v-if="allSimilarGames.length" class="mb-4">
      <h3 class="mb-3">Similar</h3>
      <div class="scroll-container pb-3">
        <GameCard v-for="game in allSimilarGames.slice(0, 10)" :key="game && game.id" :game-id="game.id" hide-platforms
          vertical hide-tags hide-title hide-progress class="scroll-item mr-3" />
      </div>
    </section>

    <section v-if="speedruns && speedruns.length" class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <i class="fa-solid fa-stopwatch me-2"></i>
        <h3 class="mb-0">Speedruns</h3>
      </div>
      <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
        <div class="card-body">
          <div v-for="(speedrun, index) in speedruns.slice(0, 1)" :key="index">
            <div class="mb-2">
              <strong>Category:</strong> {{ speedrun.category || 'Any%' }}
            </div>
            <div class="mb-3">
              <strong>Record:</strong> {{ formatTime(speedrun.time) }} by {{ speedrun.runner || 'Unknown' }}
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-primary btn-sm">View personal best</button>
              <button class="btn btn-primary btn-sm">Track your PB</button>
              <router-link :to="{ name: 'game.speedruns', params: { id: gameId, slug: route.params?.slug } }"
                class="btn btn-link btn-sm">
                View leaderboards
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="user" class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <i class="fa-regular fa-note-sticky me-2"></i>
        <h3 class="mb-0">Notes</h3>
      </div>
      <div class="card" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
        <div class="card-body">
          <div v-if="note" class="notes-list">
            <div v-for="(noteItem, index) in notesList" :key="index" class="note-item mb-3 pb-3 border-bottom">
              <div class="note-content" v-html="noteItem.content"></div>
              <div class="note-date text-muted small mt-2">
                {{ formatDate(noteItem.date) }}
              </div>
            </div>
          </div>
          <div v-else class="text-muted">
            <p>No notes yet. Add your first note!</p>
          </div>
          <div class="mt-3">
            <input type="text" class="form-control" placeholder="Add note" v-model="newNoteText"
              @keyup.enter="addNote" />
          </div>
        </div>
      </div>
    </section>

    <div class="card my-4" :class="darkTheme ? 'bg-dark text-light' : 'bg-white text-dark'">
      <div class="card-body game-details">
        <section v-if="gamePlatforms && gamePlatforms.length">
          <h3 class="mb-2">Platforms</h3>
          <router-link v-for="(platform, index) in gamePlatforms" :key="index" class="btn d-block mb-3"
            v-if="platform && platform.id" :class="darkTheme ? 'btn-dark' : 'btn-light'"
            :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id } }">
            {{ platform.name }}
          </router-link>
        </section>

        <section v-if="gameGenres && gameGenres.length">
          <h3 class="mb-2">Genres</h3>
          <router-link v-for="(genre, index) in gameGenres" :key="index" v-if="genre && genre.id"
            :to="{ name: 'search', query: { filterBy: 'genres', value: genre.id } }" class="btn d-block mb-3"
            :class="darkTheme ? 'btn-dark' : 'btn-light'">
            {{ genre.name }}
          </router-link>
        </section>

        <section v-if="gameThemes && gameThemes.length">
          <h3 class="mb-2">Themes</h3>
          <router-link v-for="(theme, index) in gameThemes" :key="index" v-if="theme && theme.id"
            :to="{ name: 'search', query: { filterBy: 'themes', value: theme.id } }" class="btn d-block mb-3"
            :class="darkTheme ? 'btn-dark' : 'btn-light'">
            {{ theme.name }}
          </router-link>
        </section>

        <section v-if="gameModes && gameModes.length">
          <h3 class="mb-2">{{ $t('board.gameModal.gameModes') }} </h3>
          <router-link v-for="(gameMode, index) in gameModes" :key="index" v-if="gameMode && gameMode.id"
            :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameMode.id } }" class="btn d-block mb-3"
            :class="darkTheme ? 'btn-dark' : 'btn-light'">
            {{ gameMode.name }}
          </router-link>
        </section>

        <section v-if="gameEngines">
          <h3 class="mb-2">Game engines</h3>
          <div v-for="(gameEngine, index) in gameEngines" :key="index" class="btn d-block mb-3"
            :class="darkTheme ? 'btn-dark' : 'btn-light'">
            {{ gameEngine.name }}
          </div>
        </section>

        <section v-if="playerPerspectives && playerPerspectives.length">
          <h3 class="mb-2">Perspective</h3>
          <router-link v-for="(perspective, index) in playerPerspectives" :key="index"
            v-if="perspective && perspective.id"
            :to="{ name: 'search', query: { filterBy: 'player_perspectives', value: perspective.id } }"
            class="btn d-block mb-3" :class="darkTheme ? 'btn-dark' : 'btn-light'">
            {{ perspective.name }}
          </router-link>
        </section>
      </div>
    </div>

    <div v-if="gameLinks.length">
      <h3 class="my-3">External links</h3>
      <a v-for="({ url, id, svg, title }, index) in gameLinks" :href="url" :key="index" class="btn btn-light me-2 mb-2"
        target="_blank">
        <img v-if="svg" :src="`/logos/companies/${id}.svg`" width="20" class="me-1" />
        <span class="text-capitalize">{{ title || id }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useNotesStore } from '@/stores/notes';
import { useProgressesStore } from '@/stores/progresses';
import { useUserStore } from '@/stores/user';
import { useAppGetters, useGameGetters } from '@/stores/getters';
import { PLATFORMS } from '@/constants';
import GameCard from '@/components/GameCard';

const route = useRoute();
const gamesStore = useGamesStore();
const notesStore = useNotesStore();
const progressesStore = useProgressesStore();
const userStore = useUserStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);
const gameId = computed(() => route.params?.id);
const user = computed(() => userStore.user);
const notes = computed(() => notesStore.notes);
const note = computed(() => gameId.value ? notes.value?.[gameId.value] : null);
const progresses = computed(() => progressesStore.progresses || {});
const gameProgress = computed(() => {
  if (!gameId.value || !progresses.value) return 0;
  const progress = progresses.value[gameId.value];
  return progress !== undefined ? progress : 0;
});

const gameGetters = computed(() => game.value ? useGameGetters(game.value) : null);
const gameGenres = computed(() => gameGetters.value?.gameGenres || []);

const gamePlatforms = computed(() => {
  return game.value?.platforms?.map(({ id }) => {
    return {
      id,
      name: PLATFORMS?.[id]?.name,
    };
  }) || [];
});

const gamePlatformsText = computed(() => {
  return gamePlatforms.value.map(p => p.name).join(', ');
});

const gameGenresText = computed(() => {
  return gameGenres.value.map(g => g.name).join(', ');
});

const playerPerspectives = computed(() => game.value?.player_perspectives || []);
const playerPerspectivesText = computed(() => {
  return playerPerspectives.value.map(p => p.name).join(', ');
});

const releaseYear = computed(() => {
  if (!game.value?.release_dates?.[0]?.date) return null;
  return new Date(game.value.release_dates[0].date * 1000).getFullYear();
});

const playtime = computed(() => {
  // Playtime would come from user's game data if tracked
  return null;
});

const gameThemes = computed(() => game.value?.themes);
const gameEngines = computed(() => game.value?.game_engines);
const gameModes = computed(() => game.value?.game_modes);
const gameLinks = computed(() => gameGetters.value?.gameLinks || []);

// Similar games
const gameRemakes = computed(() => game.value?.remakes || []);
const collectionGames = computed(() => {
  const filteredGames = game.value?.collection?.games?.filter(({ id }) => {
    const isCurrentGame = id === game.value?.id;
    return !isCurrentGame;
  });
  return filteredGames || [];
});
const gamePorts = computed(() => game.value?.ports || []);
const gameRemasters = computed(() => game.value?.remasters || []);
const similarGames = computed(() => game.value?.similar_games || []);
const gameBundles = computed(() => game.value?.bundles || []);
const parentGame = computed(() => game.value?.parent_game ? [game.value?.parent_game] : []);

const allSimilarGames = computed(() => {
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

// Speedruns
const speedruns = computed(() => {
  return game.value?.speedruns || [];
});

// Notes
const newNoteText = ref('');
const notesList = computed(() => {
  if (!note.value) return [];
  return [{
    content: note.value,
    date: new Date().toISOString(),
  }];
});

// Methods
const formatTime = (seconds) => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const addNote = async () => {
  if (!newNoteText.value.trim() || !gameId.value || !user.value) return;

  const currentNote = note.value || '';
  const newNote = currentNote
    ? `${currentNote}<br/><p>${newNoteText.value}</p>`
    : `<p>${newNoteText.value}</p>`;

  try {
    notesStore.setGameNote({ note: newNote, gameId: gameId.value });
    await notesStore.saveNotes(user.value.uid);
    newNoteText.value = '';
  } catch (e) {
    console.error('Error saving note:', e);
  }
};

// Load speedruns
const loadSpeedruns = async () => {
  if (!game.value?.name) return;
  try {
    await gamesStore.getSpeedrunGameId(game.value.name);
  } catch (error) {
    console.error('Error loading speedruns:', error);
  }
};

// Cache similar games
watch(allSimilarGames, (games) => {
  if (games?.length) gamesStore.cacheGameData(games);
});

onMounted(() => {
  if (allSimilarGames.value?.length) {
    gamesStore.cacheGameData(allSimilarGames.value);
  }
  loadSpeedruns();
});
</script>

<style lang="scss" scoped>
.scroll-container {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.scroll-item {
  display: inline-block;
  vertical-align: top;
}

.game-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem 2rem;
  font-size: 0.95rem;
  padding: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  >div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  strong {
    color: var(--bs-secondary);
    font-weight: 600;
  }
}

.game-details {
  display: grid;
  padding: 1rem;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr 1fr;
  }
}

.note-item {
  &:last-child {
    border-bottom: none !important;
  }
}

.note-content {
  :deep(p) {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
