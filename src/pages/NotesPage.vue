<template lang="html">
  <div class="px-3">
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

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <input
        v-if="showSearch"
        type="search"
        class="form-control mb-3"
        placeholder="Search notes"
        v-model="searchText"
      />

      <EmptyState
        v-if="isEmpty"
        illustration="notes"
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

      <template v-else>
        <div
          v-for="({ note, game }, index) in filteredNotes"
          :key="index"
          class="d-flex align-items-start mb-3"
        >
          <div class="flex-shrink-0 me-3">
            <GameCard
              :game-id="game.id"
              small
              hide-notes
              hide-progress
              vertical
              hide-title
              hide-platforms
            />
          </div>

          <div class="flex-grow-1">
            <h2>{{ game.name }}</h2>

            <div
              v-if="note"
              v-html="note"
              class="alert alert-warning cursor-pointer mt-3 mb-0"
              role="alert"
              @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';

const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Reactive state
const searchText = ref('');
const loading = ref(false);
const showSearch = ref(false);

// Store state and getters
const notes = computed(() => store.state.notes);
const cachedGames = computed(() => store.state.cachedGames);
const user = computed(() => store.state.user);
const darkTheme = computed(() => store.getters.darkTheme);
const buttonProps = computed(() => store.getters.buttonProps);

// Computed properties
const isEmpty = computed(() => {
  return !notes.value || !Object.keys(notes.value)?.length;
});

const filteredNotes = computed(() => {
  const notesList = Object.entries(notes.value).map(([gameId, note]) => ({
    note,
    game: cachedGames.value?.[gameId],
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
const loadGames = async () => {
  const gamesNotCached = Object.entries(notes.value)
    .map(([gameId]) => gameId)
    .filter((gameId) => !cachedGames.value[gameId]);

  if (gamesNotCached.length > 0) {
    await store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
  }
};

const openGameSelectorSidebar = () => {
  store.commit('SET_GAME_SELECTOR_DATA', {
    title: 'Select game to add a note',
  });
};

const createNote = (gameId) => {
  const game = cachedGames.value[gameId];

  if (game) {
    router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
  }
};

const openNote = (id) => {
  const game = cachedGames.value[id];

  if (game) {
    router.push({ name: 'game.notes', params: { id, slug: game.slug } });
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
