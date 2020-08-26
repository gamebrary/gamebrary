<template lang="html">
  <b-button
    v-b-modal.progress
    variant="info"
  >
    <b-icon-check />

    <b-modal
      id="progress"
      title="Set game progress"
      @show="show"
    >
      <b-input-group :prepend="`${localProgress}%`" class="mb-4" size="lg">
        <b-form-input
          size="lg"
          v-model="localProgress"
          type="range"
          max="100"
          step="5"
        />
      </b-input-group>

      <template v-slot:modal-footer>
        <b-button
          variant="danger"
          :disabled="deleting"
          @click="deleteProgress"
        >
          <b-spinner small v-if="deleting" />
          <span v-else>{{ $t('progresses.deleteProgress') }}</span>
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
          @click="saveProgress"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('progresses.save') }}</span>
        </b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      localProgress: '0',
      saving: false,
      deleting: false,
    };
  },

  computed: {
    ...mapState(['progresses']),
  },

  methods: {
    show() {
      const { id } = this.game;

      this.localProgress = this.progresses[id]
        ? JSON.parse(JSON.stringify(this.progresses[id]))
        : '0';

      this.saving = false;
      this.deleting = false;
    },

    async deleteProgress() {
      const { id, name } = this.game;

      this.deleting = true;

      this.$store.commit('REMOVE_GAME_PROGRESS', id);

      await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
        .catch(() => {
          this.$bvToast.toast('There was an error deleting your progress', { title: `${name} progress`, variant: 'error' });
          this.deleting = false;
        });

      this.$bvToast.toast('Progress deleted', { title: `${name} progress`, variant: 'success' });
      this.$bvModal.hide('progress');
    },

    async saveProgress() {
      const { id, name } = this.game;

      this.saving = true;

      this.$store.commit('SET_GAME_PROGRESS', {
        progress: this.localProgress,
        gameId: id,
      });

      await this.$store.dispatch('SAVE_PROGRESSES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your progress', { title: 'Error', variant: 'error' });
        });

      this.$bvToast.toast('Progress updated', { title: `${name} progress`, variant: 'success' });
      this.$bvModal.hide('progress');
    },
  },
};
</script>
