<!-- TODO: when file management is in place, allow to insert image from your files -->
<template lang="html">
  <!-- <modal title="Game notes" ref="notesModal" @open="reset"> -->
  <div>
    <b-button variant="primary" :title="$t('notes.addNote')">
      NOTE ICON HERE
    </b-button>

    <div slot="content" v-if="game" class="game-notes">
      <h6>Add note for {{ game.name }}</h6>

      <b-form-textarea
        v-model.trim="localNote.text"
        placeholder="Type note here"
        rows="3"
        max-rows="20"
      />

      <small>
        <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">
          SHOW EYE BALL ICON HERE
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
        <b-button
          variant="success"
          :disabled="isEmptyNote"
          @click="saveNote"
        >
          {{ $t('global.save') }}
        </b-button>

        <b-button
          v-if="localNote.text"
          @click="togglePreview"
        >
          <!-- TODO: SHOW ICON -->
          Toggle preview
        </b-button>

        <b-button variant="danger" @click="deleteNote">
          <b-icon-trash />
        </b-button>
      </div>
    </div>
  </div>
  <!-- </modal> -->
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
          this.$bvToast.toast('There was an error deleting your note', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('Note deleted', { title: 'Success', variant: 'success' });

      this.$refs.notesModal.close();
    },

    togglePreview() {
      this.showPreview = !this.showPreview;
    },

    async saveNote() {
      this.$store.commit('SET_GAME_NOTE', this.localNote);

      await this.$store.dispatch('SAVE_NOTES')
        .catch(() => {
          this.$bvToast.toast('There was an error saving your note', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('Note saved', { title: 'Success', variant: 'success' });

      this.$refs.notesModal.close();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  .preview {
    margin: 1rem 0 2rem;

    .markdown {
      margin-bottom: 1rem;
    }
  }
</style>
