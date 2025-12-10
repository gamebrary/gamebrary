<template lang="html">
  <div class="notes-layout d-flex h-100">
    <!-- Left Panel: Games List -->
    <div class="notes-list-panel" :class="darkTheme ? 'bg-dark' : 'bg-light'">
      <div class="p-3 border-bottom" :class="darkTheme ? 'border-secondary' : 'border-light'">
        <portal v-if="user && !isEmpty" to="headerActions">
          <div class="dropdown">
            <button
              class="btn dropdown-toggle"
              :class="darkTheme ? 'btn-success' : 'btn-dark'"
              type="button"
              id="notesDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Notes
            </button>
            <ul class="dropdown-menu" aria-labelledby="notesDropdown">
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="openGameSelectorSidebar"
                >
                  <i class="fa-solid fa-plus" />
                  Add note
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="showSearch = !showSearch"
                >
                  <i class="fa-solid fa-magnifying-glass" />
                  Search
                </button>
              </li>
            </ul>
          </div>
        </portal>

        <input
          v-if="showSearch"
          type="search"
          class="form-control mb-3"
          placeholder="Search notes"
          v-model="searchText"
        />
      </div>

      <div v-if="loading" class="spinner-centered d-flex justify-content-center p-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="notes-list-container">
        <EmptyState
          v-if="isEmpty"
          illustration="notes"
          class="p-5"
        >
          <p>Looks like you haven't added any notes yet.</p>
          <p>Notes are handy for keeping track of cheat codes, passwords, or just about anything you want to remember!</p>

          <button
            type="button"
            class="btn"
            :class="darkTheme ? 'btn-success' : 'btn-primary'"
            @click="openGameSelectorSidebar"
            :title="'Add games'"
          >
            Create note
          </button>
        </EmptyState>

        <EmptyState
          v-else-if="searchText.length && !filteredNotes.length"
          illustration="notes"
          message="No results"
          class="p-5"
        >
          <button
            type="button"
            class="btn"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            @click="searchText = ''"
          >
            Clear search
          </button>
        </EmptyState>

        <div v-else class="notes-list">
          <div
            v-for="({ note, game }, index) in filteredNotes"
            :key="index"
            class="notes-list-item p-3 cursor-pointer"
            :class="[
              darkTheme ? 'bg-dark' : 'bg-light',
              { 'selected': selectedGameId === game?.id },
              { 'border-bottom': index !== filteredNotes.length - 1 }
            ]"
            @click="selectGame(game)"
          >
            <div v-if="game && game.id" class="d-flex align-items-start">
              <div class="flex-shrink-0 me-3">
                <img
                  :src="getGameImageUrl(game)"
                  :alt="game.name"
                  class="rounded"
                  style="width: 60px; height: 84px; object-fit: cover; background-color: #ccc;"
                  onerror="this.style.backgroundColor='#ccc';"
                />
              </div>

              <div class="flex-grow-1 min-w-0">
                <h5 class="mb-1 text-truncate" :class="darkTheme ? 'text-light' : 'text-dark'">
                  {{ game.name }}
                </h5>
                <div
                  v-if="note"
                  v-html="getNotePreview(note)"
                  class="text-muted small"
                  style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
                />
                <span v-else class="text-muted small">No note yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Note Detail -->
    <div class="notes-detail-panel flex-grow-1">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="Component" />
        <div v-else class="d-flex align-items-center justify-content-center h-100">
          <div class="text-center text-muted p-5">
            <i class="fa-regular fa-notes fa-3x mb-3"></i>
            <p>Select a game from the list to view or edit its note</p>
          </div>
        </div>
      </router-view>
    </div>

    <GameSelectorSidebar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotesStore } from '@/stores/notes';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';
import EmptyState from '@/components/EmptyState';
import GameSelectorSidebar from '@/components/GameSelectorSidebar';

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const gamesStore = useGamesStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const twitchStore = useTwitchStore();
const { darkTheme } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const searchText = ref('');
const loading = ref(false);
const showSearch = ref(false);

// Store state and getters
const notes = computed(() => notesStore.notes);
const cachedGames = computed(() => gamesStore.cachedGames);
const user = computed(() => userStore.user);

// Computed properties
const selectedGameId = computed(() => route.params?.id ? Number(route.params.id) : null);

const isEmpty = computed(() => {
  return !notes.value || !Object.keys(notes.value)?.length;
});

const filteredNotes = computed(() => {
  const notesList = Object.entries(notes.value).map(([gameId, note]) => ({
    note,
    game: cachedGames.value?.[gameId],
    gameId: Number(gameId),
  }));

  const searchTextLower = searchText.value?.toLowerCase();

  if (searchTextLower) {
    return notesList.filter(({ game, note }) => {
      const noteIsMatch = note?.toLowerCase()?.includes(searchTextLower);
      const titleIsMatch = game?.name?.toLowerCase()?.includes(searchTextLower);

      return noteIsMatch || titleIsMatch;
    });
  }

  return notesList;
});

// Methods
const getGameImageUrl = (game) => {
  return getImageUrl(game, IMAGE_SIZE_COVER_SMALL);
};

const getNotePreview = (noteHtml) => {
  // Strip HTML tags and get first few words
  const text = noteHtml.replace(/<[^>]*>/g, '').trim();
  return text.length > 50 ? text.substring(0, 50) + '...' : text;
};

const selectGame = (game) => {
  if (game?.id) {
    router.push({ name: 'notes.detail', params: { id: game.id } });
  }
};

const loadGames = async () => {
  const gamesNotCached = Object.entries(notes.value)
    .map(([gameId]) => gameId)
    .filter((gameId) => !cachedGames.value[gameId]);

  if (gamesNotCached.length > 0) {
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }
    await gamesStore.loadIGDBGames(twitchStore.twitchToken, gamesNotCached);
  }
};

const openGameSelectorSidebar = () => {
  uiStore.setGameSelectorData({
    title: 'Select game to add a note',
  });
};

const openNote = (id) => {
  const game = cachedGames.value[id];

  if (game) {
    router.push({ name: 'notes.detail', params: { id: game.id } });
  }
};

// Lifecycle hooks
onMounted(() => {
  if ($bus) {
    $bus.$on('SELECT_GAME', openNote);
  }
  loadGames();
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('SELECT_GAME', openNote);
  }
});
</script>

<style lang="scss" scoped>
.notes-layout {
  height: calc(100vh - 60px); // Adjust based on your header height
  overflow: hidden;
}

.notes-list-panel {
  width: 350px;
  min-width: 350px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bs-border-color);
  overflow: hidden;
}

.notes-list-container {
  flex: 1;
  overflow-y: auto;
}

.notes-list-item {
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--bs-gray-100) !important;
  }

  &.selected {
    background-color: var(--bs-primary) !important;
    color: white;

    h5, .text-muted {
      color: white !important;
    }
  }
}

.notes-detail-panel {
  overflow-y: auto;
  background-color: var(--bs-body-bg);
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 768px) {
  .notes-list-panel {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }

  .notes-layout {
    flex-direction: column;
  }
}
</style>
