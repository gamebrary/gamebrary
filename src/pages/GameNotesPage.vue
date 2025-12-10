<template lang="html">
  <div class="game-notes-detail h-100 d-flex flex-column"
    :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
    <div v-if="loading" class="spinner-centered d-flex justify-content-center flex-grow-1">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="!game || !game.id" class="d-flex align-items-center justify-content-center flex-grow-1">
      <div class="text-center">
        <p class="text-muted">Select a game from the list to view or edit its note</p>
      </div>
    </div>

    <div v-else class="d-flex flex-column h-100 p-4">
      <div class="mb-4">
        <div class="d-flex align-items-center mb-3">
          <router-link v-if="game?.id && game?.slug" :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            class="flex-shrink-0">
            <img :src="getGameImageUrl(game)" :alt="game.name" class="rounded me-3"
              style="width: 80px; height: 112px; object-fit: cover; background-color: #ccc;"
              onerror="this.style.backgroundColor='#ccc';" />
          </router-link>
          <img v-else :src="getGameImageUrl(game)" :alt="game.name" class="rounded me-3 flex-shrink-0"
            style="width: 80px; height: 112px; object-fit: cover; background-color: #ccc;"
            onerror="this.style.backgroundColor='#ccc';" />
          <div>
            <h3 class="mb-1">{{ game.name }}</h3>
          </div>
        </div>
      </div>

      <div v-if="editor" class="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group">
          <button type="button" class="btn"
            :class="editor.isActive('paragraph') ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().setParagraph().run()" :title="'Regular text'" data-bs-toggle="tooltip">
            <i class="fa-solid fa-font fa-fw" />
          </button>

          <button type="button" class="btn"
            :class="editor.isActive('heading', { level: 1 }) ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :title="'Heading 1'"
            data-bs-toggle="tooltip">
            <span class="fa-layers fa-fw">
              <i class="fa-solid fa-heading fa-fw" />
              <i class="fa-solid fa-1" />
            </span>
          </button>

          <button type="button" class="btn"
            :class="editor.isActive('heading', { level: 2 }) ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :title="'Heading 2'"
            data-bs-toggle="tooltip">
            <span class="fa-layers fa-fw">
              <i class="fa-solid fa-heading fa-fw" />
              <i class="fa-solid fa-2" />
            </span>
          </button>

          <button type="button" class="btn"
            :class="editor.isActive('heading', { level: 3 }) ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :title="'Heading 3'"
            data-bs-toggle="tooltip">
            <span class="fa-layers fa-fw">
              <i class="fa-solid fa-heading fa-fw" />
              <i class="fa-solid fa-3" />
            </span>
          </button>
        </div>

        <div class="btn-group" role="group">
          <button type="button" class="btn"
            :class="editor.isActive('bold') ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleBold().run()" :title="'Bold'" data-bs-toggle="tooltip">
            <i class="fa-solid fa-bold fa-fw" />
          </button>
          <button type="button" class="btn"
            :class="editor.isActive('italic') ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleItalic().run()" :title="'Italic'" data-bs-toggle="tooltip">
            <i class="fa-solid fa-italic fa-fw" />
          </button>
          <button type="button" class="btn"
            :class="editor.isActive('strike') ? (darkTheme ? 'btn-primary' : 'btn-dark') : (darkTheme ? 'btn-secondary' : 'btn-light')"
            @click="editor.chain().focus().toggleStrike().run()" :title="'Strikethrough'" data-bs-toggle="tooltip">
            <i class="fa-solid fa-strikethrough fa-fw" />
          </button>
        </div>
      </div>

      <div class="flex-grow-1 d-flex flex-column mb-3">
        <editor-content :editor="editor" class="flex-grow-1" />
      </div>

      <a href="#" class="small link-primary mb-3" data-bs-toggle="modal" data-bs-target="#markdown-cheatsheet"
        @click.prevent>
        <i class="fab fa-markdown fa-fw" />
        Markdown supported
      </a>

      <footer class="d-flex">
        <button type="button" class="btn btn-primary" :disabled="saving" @click="saveNote">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>{{ $t('global.save') }}</span>
        </button>

        <button type="button" class="btn btn-danger ms-2" v-if="!saving" :disabled="deleting" @click="deleteNote">
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else class="fas fa-trash" aria-hidden />
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotesStore } from '@/stores/notes';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';
import { IGDB_QUERIES } from '@/constants';

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const gamesStore = useGamesStore();
const userStore = useUserStore();
const twitchStore = useTwitchStore();
const { darkTheme } = useAppGetters();

const saving = ref(false);
const note = ref('');
const loading = ref(true);
const deleting = ref(false);
const editor = ref(null);

const gameId = computed(() => route.params?.id ? Number(route.params.id) : null);
const notes = computed(() => notesStore.notes);
const cachedGames = computed(() => gamesStore.cachedGames);
const game = computed(() => {
  if (gameId.value && cachedGames.value?.[gameId.value]) {
    return cachedGames.value[gameId.value];
  }
  return gamesStore.game;
});

const getGameImageUrl = (gameItem) => {
  return getImageUrl(gameItem, IMAGE_SIZE_COVER_SMALL);
};

const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

const loadGame = async () => {
  if (!gameId.value) {
    loading.value = false;
    return;
  }

  const gameCached = cachedGames.value?.[gameId.value];

  if (gameCached) {
    gamesStore.setGame(gameCached);
    setNote();
    loading.value = false;
    return;
  }

  gamesStore.clearGame();
  loading.value = true;

  try {
    if (!twitchStore.twitchToken) {
      await twitchStore.getTwitchToken();
    }
    const results = await gamesStore.queryIGDB({
      path: 'games',
      data: `${IGDB_QUERIES.GAME} where id = ${gameId.value};`,
    });
    if (results && results.length > 0) {
      gamesStore.setGame(results[0]);
    }
    setNote();
  } catch (e) {
    console.error('Error loading game:', e);
  }

  loading.value = false;
};

const setNote = () => {
  if (!gameId.value) return;

  note.value = notes.value[gameId.value] || '';

  if (editor.value) {
    editor.value.destroy();
  }

  editor.value = new Editor({
    content: note.value,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'border rounded p-3 h-100',
      },
    },
    onUpdate: () => {
      note.value = editor.value.getHTML();
    },
  });
};

const saveNote = async () => {
  if (!gameId.value) return;

  saving.value = true;

  notesStore.setGameNote({ note: note.value, gameId: gameId.value });

  try {
    await notesStore.saveNotes(userStore.user.uid);
    showToast('Note saved', 'success');
  } catch (e) {
    console.error('Error saving note:', e);
    showToast('Error saving note', 'danger');
  }

  saving.value = false;
};

const deleteNote = async () => {
  if (!gameId.value || !game.value) return;

  deleting.value = true;

  notesStore.removeGameNote(game.value.id);

  try {
    await notesStore.saveNotesNoMerge(userStore.user.uid);
    note.value = '';
    if (editor.value) {
      editor.value.setContent('');
    }
    showToast('Note deleted', 'success');
  } catch (e) {
    deleting.value = false;
    showToast('There was an error deleting your note', 'danger');
  }
};

const showToast = (message, variant = 'info') => {
  const toastElement = document.createElement('div');
  toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
};

watch(() => route.params?.id, (newId) => {
  if (newId) {
    loadGame();
  }
});

onMounted(() => {
  loadGame();
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style lang="scss" scoped>
.game-notes-detail {
  min-height: 100%;
}

:deep(.ProseMirror) {
  min-height: 400px;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}
</style>
