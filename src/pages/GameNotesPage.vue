<template lang="html">
  <section>
    <div class="container">
      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="row">
        <portal to="pageTitle">
          <h3>Notes</h3>
        </portal>

        <div class="col-12 col-sm-8 offset-sm-2">
          <div class="mb-3">
            <GameCard
              :game-id="game.id"
              class="mb-3"
            />

            <router-link
              v-if="game?.id && game?.slug"
              class="small mt-n2"
              :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            >
              {{ game.name }}
            </router-link>
            <span v-else class="small mt-n2">{{ game?.name }}</span>
          </div>

          <div
            v-if="editor"
            class="btn-toolbar mb-3"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div class="btn-group me-2" role="group">
              <button
                type="button"
                class="btn"
                :class="editor.isActive('paragraph') ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().setParagraph().run()"
                :title="'Regular text'"
                data-bs-toggle="tooltip"
              >
                <i class="fa-solid fa-font fa-fw" />
              </button>

              <button
                type="button"
                class="btn"
                :class="editor.isActive('heading', { level: 1 }) ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :title="'Heading 1'"
                data-bs-toggle="tooltip"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-1" />
                </span>
              </button>

              <button
                type="button"
                class="btn"
                :class="editor.isActive('heading', { level: 2 }) ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :title="'Heading 2'"
                data-bs-toggle="tooltip"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-2" />
                </span>
              </button>

              <button
                type="button"
                class="btn"
                :class="editor.isActive('heading', { level: 3 }) ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :title="'Heading 3'"
                data-bs-toggle="tooltip"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-3" />
                </span>
              </button>
            </div>

            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn"
                :class="editor.isActive('bold') ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleBold().run()"
                :title="'Bold'"
                data-bs-toggle="tooltip"
              >
                <i class="fa-solid fa-bold fa-fw" />
              </button>
              <button
                type="button"
                class="btn"
                :class="editor.isActive('italic') ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleItalic().run()"
                :title="'Italic'"
                data-bs-toggle="tooltip"
              >
                <i class="fa-solid fa-italic fa-fw" />
              </button>
              <button
                type="button"
                class="btn"
                :class="editor.isActive('strike') ? 'btn-dark' : 'btn-light'"
                @click="editor.chain().focus().toggleStrike().run()"
                :title="'Strikethrough'"
                data-bs-toggle="tooltip"
              >
                <i class="fa-solid fa-strikethrough fa-fw" />
              </button>
            </div>
          </div>

          <editor-content :editor="editor" />

          <a
            href="#"
            class="small link-primary"
            data-bs-toggle="modal"
            data-bs-target="#markdown-cheatsheet"
            @click.prevent
          >
            <i class="fab fa-markdown fa-fw" />
            Markdown supported
          </a>

          <footer class="mt-2 d-flex">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="saving"
              @click="saveNote"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <span v-else>{{ $t('global.save') }}</span>
            </button>

            <button
              type="button"
              class="btn btn-danger ms-2"
              v-if="!saving"
              :disabled="deleting"
              @click="deleteNote"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="fas fa-trash" aria-hidden />
            </button>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotesStore } from '@/stores/notes';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import { useTwitchStore } from '@/stores/twitch';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import GameCard from '@/components/GameCard';
import { IGDB_QUERIES } from '@/constants';

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const gamesStore = useGamesStore();
const userStore = useUserStore();
const twitchStore = useTwitchStore();

const saving = ref(false);
const note = ref('');
const loading = ref(true);
const deleting = ref(false);
const editor = ref(null);

const gameId = computed(() => route.params?.id);
const notes = computed(() => notesStore.notes);
const game = computed(() => gamesStore.game);

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
  const gameCached = game.value?.id == gameId.value;

  if (gameCached) {
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
  note.value = notes.value[gameId.value] || '';

  if (editor.value) {
    editor.value.destroy();
  }

  editor.value = new Editor({
    content: note.value,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'border rounded p-3',
      },
    },
    onUpdate: () => {
      note.value = editor.value.getHTML();
    },
  });
};

const saveNote = async () => {
  saving.value = true;

  notesStore.setGameNote({ note: note.value, gameId: gameId.value });

  try {
    await notesStore.saveNotes(userStore.user.uid);
  } catch (e) {
    console.error('Error saving note:', e);
  }

  saving.value = false;

  router.push({
    name: 'game',
    params: {
      id: game.value.id,
      slug: game.value.slug,
    },
  });
};

const deleteNote = async () => {
  deleting.value = true;

  notesStore.removeGameNote(game.value.id);

  try {
    await notesStore.saveNotesNoMerge(userStore.user.uid);
    note.value = '';
    router.push({ name: 'game', params: { id: game.value.id, slug: game.value.slug } });
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

<style>
.ProseMirror {
  min-height: 50vh;
}
</style>
