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

<script>
import { mapState } from 'vuex';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import GameCard from '@/components/GameCard';

import { IGDB_QUERIES } from '@/constants';

export default {
  components: {
    EditorContent,
    GameCard,
  },

  data() {
    return {
      saving: false,
      note: '',
      loading: true,
      deleting: false,
      editor: null,
    };
  },

  computed: {
    ...mapState(['notes', 'game']),

    gameId() {
      return this.$route?.params?.id;
    },
  },

  mounted() {
    this.loadGame();
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },

  methods: {
    initTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
          }
        });
      });
    },

    async loadGame() {
      const gameCached = this.game?.id == this.gameId;

      if (gameCached) {
        this.setNote();
        this.loading = false;

        return;
      }

      this.$store.commit('CLEAR_GAME');
      this.loading = true;

      try {
        await this.$store.dispatch('IGDB', {
          path: 'games',
          data: `${IGDB_QUERIES.GAME} where id = ${this.gameId};`,
          mutation: 'SET_GAME',
        });

        this.setNote();
      } catch (e) {}

      this.loading = false;
    },

    setNote() {
      this.note = this.notes[this.gameId] || '';

      this.editor = new Editor({
        content: this.note,
        extensions: [StarterKit],
        editorProps: {
          attributes: {
            class: 'border rounded p-3',
          },
        },
        onUpdate: () => {
          this.note = this.editor.getHTML();
        },
      })

    },

    async saveNote() {
      this.saving = true;

      this.$store.commit('SET_GAME_NOTE', { note: this.note, gameId: this.gameId });

      await this.$store.dispatch('SAVE_NOTES').catch(() => {
        //
      });

      this.saving = false;

      this.$router.push({
        name: 'game',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    async deleteNote() {
      this.deleting = true;

      this.$store.commit('REMOVE_GAME_NOTE', this.game.id);

      await this.$store.dispatch('SAVE_NOTES_NO_MERGE')
        .catch(() => {
          this.deleting = false;
          this.showToast('There was an error deleting your note', 'danger');
        });

      this.note = '';

      this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug } });
    },

    showToast(message, variant = 'info') {
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
    },
  },
};
</script>

<style>
.ProseMirror {
  min-height: 50vh;
}
</style>
