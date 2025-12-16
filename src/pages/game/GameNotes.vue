<template>
  <div class="tab-pane fade show active">
    <div v-if="user" class="game-notes-tab">
      <div v-if="note" class="notes-list">
        <div
          v-for="(noteItem, index) in notesList"
          :key="index"
          class="note-item mb-3 p-3 rounded"
          :class="darkTheme ? 'bg-dark border border-secondary' : 'bg-light border'"
        >
          <div class="note-content" v-html="noteItem.content"></div>
          <div class="note-date text-muted small mt-2">
            {{ formatDate(noteItem.date) }}
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted py-5">
        <i class="fa-regular fa-note-sticky fa-3x mb-3"></i>
        <p>No notes yet</p>
        <router-link
          :to="{ name: 'game.notes', params: { id: gameId, slug: route.params?.slug } }"
          class="btn btn-primary"
        >
          Add note
        </router-link>
      </div>
    </div>
    <div v-else class="text-center text-muted py-5">
      <i class="fa-regular fa-note-sticky fa-3x mb-3"></i>
      <p>Sign in to add notes</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import { useNotesStore } from '@/stores/notes';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';

const route = useRoute();

const gamesStore = useGamesStore();
const notesStore = useNotesStore();
const userStore = useUserStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);
const gameId = computed(() => route.params?.id);
const user = computed(() => userStore.user);
const notes = computed(() => notesStore.notes);
const note = computed(() => gameId.value ? notes.value?.[gameId.value] : null);

const notesList = computed(() => {
  if (!note.value) return [];
  // Simple parsing - if note contains date markers, split them
  // Otherwise, treat as single note
  const noteText = note.value;
  // For now, return single note with current date
  // In a real implementation, you might want to parse multiple notes
  return [{
    content: noteText,
    date: new Date().toISOString(),
  }];
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<style lang="scss" scoped>
.note-item {
  transition: transform 0.2s;

  &:hover {
    transform: translateX(4px);
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

