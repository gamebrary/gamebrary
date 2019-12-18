<template lang="html">
  <div class="game-notes">
    <h3>Game notes</h3>

    <div v-if="hasNote && !showNoteField" class="note">
      <div class="markdown" v-if="localNote.text">
        <vue-markdown :source="localNote.text" />
      </div>

      <button class="primary" @click="editNote">
        <i class="fas fa-pen" />
        Edit note
      </button>
    </div>

    <div v-if="showNoteField">
      <textarea
        v-model="localNote.text"
        placeholder="Type note here"
        cols="30"
        rows="5"
      />

      <small>
        <i class="fab fa-markdown" />
        <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">
          Markdown supported
        </a>
      </small>

      <footer>
        <button class="secondary" @click="reset">
          {{ $t('global.cancel') }}
        </button>

        <button class="primary" @click="saveNote">
          {{ $t('global.save') }}
        </button>

        <button class="danger" @click="deleteNote">
          <i class="fas fa-trash-alt" />
          Delete note
        </button>
      </footer>
    </div>

    <button v-if="!hasNote && !showNoteField" class="primary" @click="addNote">
      <i class="fas fa-sticky-note" />
      {{ $t('notes.addNote') }}
    </button>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    VueMarkdown,
  },

  data() {
    return {
      showNoteField: false,
      localNote: {
        text: null,
      },
    };
  },

  computed: {
    ...mapState(['game', 'notes']),
    ...mapGetters(['gameNote']),

    hasNote() {
      return this.gameNote && this.gameNote.text;
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    reset() {
      this.localNote = this.gameNote
        ? JSON.parse(JSON.stringify(this.gameNote))
        : { text: null };

      this.showNoteField = false;
    },

    addNote() {
      this.showNoteField = true;
    },

    editNote() {
      this.showNoteField = true;
    },

    deleteNote() {
      const updatedNotes = {
        ...this.notes,
      };

      this.$delete(updatedNotes, this.game.id);

      this.$bus.$emit('SAVE_NOTES', updatedNotes, true);
      this.showNoteField = false;
      this.localNote = {
        text: null,
      };
    },

    saveNote() {
      const updatedNotes = {
        ...this.notes,
      };

      updatedNotes[this.game.id] = this.localNote;

      this.$bus.$emit('SAVE_NOTES', updatedNotes);
      this.showNoteField = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-notes {
    max-width: calc(100% - #{$gp});
  }

  .markdown {
    margin-bottom: $gp;
  }

  textarea {
    margin-top: $gp;
    margin-bottom: 0;
    resize: vertical;
    padding: $gp / 2;
  }

  footer {
    display: flex;
    align-items: center;
    margin-top: $gp;

    .secondary {
      margin-right: $gp;
    }

    .danger {
      margin-left: auto;
    }
  }

</style>
