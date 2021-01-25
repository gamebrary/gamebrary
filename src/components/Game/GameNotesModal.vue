<template lang="html">
  <b-dropdown-item v-b-modal.notes>
    <i class="far fa-sticky-note fa-fw" /> {{ localNote ? 'Edit note' : 'Add note' }}

    <b-modal
      id="notes"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      footer-class="d-flex justify-content-between"
      @show="show"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Game notes"
          :subtitle="game.name"
          @close="close"
        />
      </template>

      <b-form-textarea
        v-model.trim="localNote"
        placeholder="Type note here"
        rows="3"
        max-rows="20"
      />

      <b-form-text id="input-live-help">
        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
          <i class="fab fa-markdown"></i>
          Markdown supported
        </a>
      </b-form-text>

      <template v-slot:modal-footer>
        <b-button
          variant="danger"
          v-if="notes[game.id]"
          :disabled="deleting"
          @click="deleteNote"
        >
          <b-spinner small v-if="deleting" />
          <span v-else>{{ $t('global.delete') }}</span>
        </b-button>

        <div :class="!notes[game.id] ? 'ml-auto' : ''">
          <b-button
            variant="primary"
            :disabled="saving"
            @click="saveNote"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      localNote: '',
      deleting: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['notes']),
    ...mapGetters(['nightMode']),
  },

  methods: {
    show() {
      this.deleting = false;
      this.saving = false;

      const { id } = this.game;

      if (this.notes[id]) {
        this.localNote = typeof this.notes[id] === 'object' && this.notes[id].text
          ? this.notes[id].text
          : JSON.parse(JSON.stringify(this.notes[id]));
      }
    },

    async saveNote() {
      this.saving = true;

      this.$store.commit('SET_GAME_NOTE', {
        note: this.localNote,
        gameId: this.game.id,
      });

      await this.$store.dispatch('SAVE_NOTES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your note', { variant: 'danger' });
        });

      this.$bvToast.toast('Note saved');

      this.$bvModal.hide('notes');
    },

    async deleteNote() {
      this.deleting = true;
      this.localNote = '';

      this.$store.commit('REMOVE_GAME_NOTE', this.game.id);

      await this.$store.dispatch('SAVE_NOTES_NO_MERGE')
        .catch(() => {
          this.deleting = false;
          this.$bvToast.toast('There was an error deleting your note', { variant: 'danger' });
        });

      this.$bvToast.toast('Note deleted');
      this.$bvModal.hide('notes');
    },
  },
};
</script>
