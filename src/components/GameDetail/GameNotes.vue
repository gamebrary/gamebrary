<!-- TODO: when file management is in place, allow to insert image from your files -->
<template lang="html">
  <modal title="Game notes" ref="notesModal" @open="reset">
    <button class="primary" :title="$t('notes.addNote')">
      <i class="fas fa-sticky-note" />
    </button>

    <div slot="content" v-if="game" class="game-notes">
      <h3>Add note for {{ game.name }}</h3>

      <textarea
        v-model.trim="localNote.text"
        placeholder="Type note here"
        cols="30"
        rows="10"
      />

      <small>
        <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">
          <i class="fab fa-markdown" />
          Markdown supported
        </a>
      </small>

      <div class="preview" v-if="!isEmptyNote && showPreview">
        <h3>Preview</h3>

        <div class="markdown">
          <vue-markdown :source="localNote.text" />
        </div>
      </div>

      <div class="actions">
        <button
          class="primary save"
          :disabled="isEmptyNote"
          @click="saveNote"
        >
          {{ $t('global.save') }}
        </button>

        <button
          class="primary"
          v-if="localNote.text"
          @click="togglePreview"
        >
          <i :class="`far fa-eye${showPreview ? '-slash' : ''}`" />
          Toggle preview
        </button>

        <button class="danger" @click="deleteNote">
          <i class="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import Modal from '@/components/Modal';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    VueMarkdown,
    Modal,
  },

  data() {
    return {
      showPreview: false,
      localNote: {
        text: null,
      },
    };
  },

  computed: {
    ...mapState(['game']),
    ...mapGetters(['gameNote']),

    isEmptyNote() {
      return Boolean(this.localNote && this.localNote.text === null);
    },
  },

  methods: {
    reset() {
      this.localNote = this.gameNote
        ? JSON.parse(JSON.stringify(this.gameNote))
        : { text: null };
    },

    async deleteNote() {
      this.$store.commit('REMOVE_GAME_NOTE');

      await this.$store.dispatch('SAVE_NOTES_NO_MERGE')
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error deleting your note', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'Note deleted' });
      this.$refs.notesModal.close();
    },

    togglePreview() {
      this.showPreview = !this.showPreview;
    },

    async saveNote() {
      this.$store.commit('SET_GAME_NOTE', this.localNote);

      await this.$store.dispatch('SAVE_NOTES')
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your note', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'Note saved' });
      this.$refs.notesModal.close();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .preview {
    margin: $gp 0 $gp * 2;

    .markdown {
      margin-bottom: $gp;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    margin-top: $gp;

    .save {
      margin-right: $gp / 2;
    }

    .danger {
      margin-left: auto;
    }
  }

</style>
