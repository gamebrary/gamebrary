<!-- TODO: make it more portable, put trigger in slot -->
<!-- TODO: translate -->

<template lang="html">
  <b-button
    v-b-modal.notes
    variant="warning"
    v-b-tooltip.hover
    title="Game notes"
   >
    <i class="far fa-sticky-note"></i>

    <b-modal
      id="notes"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      footer-class="d-flex justify-content-between"
      @show="show"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Game notes"
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
          Markdown supported
        </a>
      </b-form-text>

      <template v-slot:modal-footer="{ cancel }">
        <b-button
          variant="danger"
          :disabled="deleting || !notes[game.id]"
          @click="deleteNote"
        >
          <b-spinner small v-if="deleting" />
          <span v-else>{{ $t('global.delete') }}</span>
        </b-button>

        <div>
          <b-button
            variant="light"
            class="mx-2"
            :disabled="saving"
            @click="cancel"
          >
            {{ $t('global.cancel') }}
          </b-button>

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
  </b-button>
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

      // TODO: use optional chaining
      this.localNote = this.notes[id] && typeof this.notes[id] === 'object' && this.notes[id].text
        ? this.notes[id].text
        : JSON.parse(JSON.stringify(this.notes[id]));
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
