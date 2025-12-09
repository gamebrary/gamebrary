<template lang="html">
  <div class="small-container">
    <input
      v-model="note.title"
      type="text"
      class="form-control mb-3"
      placeholder="Title"
    />

    <div
      v-if="editor"
      class="btn-toolbar mb-3"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div class="btn-group me-2" role="group">
        <button
          type="button"
          class="btn btn-sm"
          :class="editor.isActive('paragraph') ? 'btn-dark' : 'btn-light'"
          @click="editor.chain().focus().setParagraph().run()"
          :title="'Regular text'"
          data-bs-toggle="tooltip"
        >
          <i class="fa-solid fa-font fa-fw" />
        </button>

        <button
          type="button"
          class="btn btn-sm"
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
          class="btn btn-sm"
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
          class="btn btn-sm"
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
          class="btn btn-sm"
          :class="editor.isActive('bold') ? 'btn-dark' : 'btn-light'"
          @click="editor.chain().focus().toggleBold().run()"
          :title="'Bold'"
          data-bs-toggle="tooltip"
        >
          <i class="fa-solid fa-bold fa-fw" />
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="editor.isActive('italic') ? 'btn-dark' : 'btn-light'"
          @click="editor.chain().focus().toggleItalic().run()"
          :title="'Italic'"
          data-bs-toggle="tooltip"
        >
          <i class="fa-solid fa-italic fa-fw" />
        </button>
        <button
          type="button"
          class="btn btn-sm"
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

    <footer class="mt-3">
      <button type="button" class="btn btn-primary" @click="createNote">
        Save note
      </button>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      note: {
          title: '',
          body: '',
          pinned: false,
          backgroundColor: null,
          games: [],
          public: false,
      },
      saving: false,
      editor: null,
    };
  },

  computed: {
      ...mapState(['user']),
  },

  mounted() {
    this.editor = new Editor({
      content: this.note.body,
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class: 'border rounded p-3',
        },
      },
      onUpdate: () => {
        this.note.body = this.editor.getHTML();
      },
    });
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
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

    createNote() {
      const dateCreated = Date.now();

      const payload = {
        ...this.note,
        dateCreated,
        lastUpdated: dateCreated,
        owner: this.user?.uid,
      }

      this.$store.dispatch('CREATE_NOTE_V2', payload)
      // const game = this.cachedGames[gameId];

      // this.$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } });
    },
  },
};
</script>
