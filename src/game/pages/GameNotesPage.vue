<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <!-- TODO: allow to customize note -->
      <!-- TODO: Add note title? -->
      <!-- TODO: allow to use wallpapers in notes (use ref?) -->

      <b-row v-else>
        <portal to="pageTitle">
          <div class="d-flex">
            <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug } }">
              <b-img
                :src="$options.getImageUrl(game)"
                class="mr-2"
                style="max-height: 40px; width: auto;"
              />
            </router-link>

            <div class="d-flex flex-column">
              <h3 style="line-height: initial;">Notes</h3>

              <router-link
                class="small mt-n2"
                :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
              >
                {{ game.name }}
              </router-link>
            </div>
          </div>
        </portal>

        <portal to="headerActions">
          <b-button
            :to="{ name: 'notes' }"
            variant="light"
            class="mr-2"
          >
            <i class="fa fa-book fa-fw" aria-hidden="true" />
            Notes
          </b-button>
        </portal>

        <b-col cols="12" sm="8" offset-sm="2">
          <b-button-toolbar
            v-if="editor"
            key-nav
            class="mb-3"
            aria-label="Toolbar with button groups"
          >
            <b-button-group>
              <b-button
                @click="editor.chain().focus().setParagraph().run()"
                v-b-tooltip.hover
                title="Regular text"
                :variant="editor.isActive('paragraph') ? 'dark' : 'light'"
              >
                <i class="fa-solid fa-font fa-fw" />
              </b-button>

              <b-button
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                v-b-tooltip.hover
                title="Heading 1"
                :variant="editor.isActive('heading', { level: 1 }) ? 'dark' : 'light'"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-1" />
                </span>
              </b-button>

              <b-button
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                v-b-tooltip.hover
                title="Heading 2"
                :variant="editor.isActive('heading', { level: 2 }) ? 'dark' : 'light'"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-2" />
                </span>
              </b-button>

              <b-button
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                v-b-tooltip.hover
                title="Heading 3"
                :variant="editor.isActive('heading', { level: 3 }) ? 'dark' : 'light'"
              >
                <span class="fa-layers fa-fw">
                  <i class="fa-solid fa-heading fa-fw" />
                  <i class="fa-solid fa-3" />
                </span>
              </b-button>
            </b-button-group>
            <b-button-group class="mx-1">
              <b-button
                @click="editor.chain().focus().toggleBold().run()"
                v-b-tooltip.hover
                title="Bold"
                :variant="editor.isActive('bold') ? 'dark' : 'light'"
              >
                <i class="fa-solid fa-bold fa-fw" />
              </b-button>
              <b-button
                @click="editor.chain().focus().toggleItalic().run()"
                v-b-tooltip.hover
                title="Italic"
                :variant="editor.isActive('italic') ? 'dark' : 'light'"
              >
                <i class="fa-solid fa-italic fa-fw" />
              </b-button>
              <b-button
                @click="editor.chain().focus().toggleStrike().run()"
                v-b-tooltip.hover
                title="Strikethrough"
                :variant="editor.isActive('strike') ? 'dark' : 'light'"
              >
                <i class="fa-solid fa-strikethrough fa-fw" />
              </b-button>
            </b-button-group>
          </b-button-toolbar>

          <editor-content :editor="editor" />

          <b-link
            class="small"
            v-b-modal.markdown-cheatsheet
          >
            <i class="fab fa-markdown fa-fw" />
            Markdown supported
          </b-link>

          <footer class="mt-2 d-flex">
            <b-button
              variant="primary"
              :disabled="saving"
              @click="saveNote"
            >
              <b-spinner small v-if="saving" />
              <span v-else>{{ $t('global.save') }}</span>
            </b-button>

            <b-button
              variant="danger"
              class="ml-2"
              v-if="!saving"
              :disabled="deleting"
              @click="deleteNote"
            >
              <b-spinner small v-if="deleting" />
              <i v-else class="fas fa-trash" aria-hidden />
            </b-button>
          </footer>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import { getImageUrl } from '@/utils';
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import { IGDB_QUERIES } from '@/constants';

export default {
  getImageUrl,

  components: {
    EditorContent,
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
    ...mapState(['notes', 'game', 'games']),

    gameId() {
      return this.$route?.params?.id;
    },
  },

  mounted() {
    this.loadGame();
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
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

      await this.$store.dispatch('SAVE_NOTES').catch(() => {});

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
          this.$bvToast.toast('There was an error deleting your note', { variant: 'danger' });
        });

      this.note = '';

      this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug } });
    },
  },
};
</script>

<style>
.ProseMirror {
  min-height: 50vh;
}
</style>