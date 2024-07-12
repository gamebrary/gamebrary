<template lang="html">
  <div class="small-container">
    <b-form-input
      v-model="note.title"
      class="mb-3"
      placeholder="Title"
    />

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
          size="sm"
          :variant="editor.isActive('paragraph') ? 'dark' : 'light'"
        >
          <i class="fa-solid fa-font fa-fw" />
        </b-button>

        <b-button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          v-b-tooltip.hover
          title="Heading 1"
          size="sm"
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
          size="sm"
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
          size="sm"
          :variant="editor.isActive('heading', { level: 3 }) ? 'dark' : 'light'"
        >
          <span class="fa-layers fa-fw">
            <i class="fa-solid fa-heading fa-fw" />
            <i class="fa-solid fa-3" />
          </span>
        </b-button>
      </b-button-group>

      <b-button-group class="mx-3">
        <b-button
          @click="editor.chain().focus().toggleBold().run()"
          v-b-tooltip.hover
          title="Bold"
          size="sm"
          :variant="editor.isActive('bold') ? 'dark' : 'light'"
        >
          <i class="fa-solid fa-bold fa-fw" />
        </b-button>
        <b-button
          @click="editor.chain().focus().toggleItalic().run()"
          v-b-tooltip.hover
          title="Italic"
          size="sm"
          :variant="editor.isActive('italic') ? 'dark' : 'light'"
        >
          <i class="fa-solid fa-italic fa-fw" />
        </b-button>
        <b-button
          @click="editor.chain().focus().toggleStrike().run()"
          v-b-tooltip.hover
          title="Strikethrough"
          size="sm"
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

    <footer class="mt-3">
      <b-button variant="primary" @click="createNote">
        Save note
      </b-button>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Editor, EditorContent } from '@tiptap/vue-2';
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
  },

  methods: {
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
