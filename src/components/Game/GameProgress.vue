<template lang="html">
  <b-dropdown-item v-b-modal.progress>
    <i class="fas fa-stopwatch fa-fw" />

    {{ title }}

    <b-modal
      id="progress"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      footer-class="d-flex justify-content-between pt-0"
      @show="show"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('progresses.modalTitle')"
          :subtitle="game.name"
          @close="close"
        />
      </template>

      <b-input-group :prepend="`${localProgress}%`" size="lg">
        <b-form-input
          size="lg"
          v-model="localProgress"
          type="range"
          max="100"
          step="1"
        />
      </b-input-group>

      <template v-slot:modal-footer>
        <b-button
          variant="danger"
          :disabled="deleting"
          @click="deleteProgress"
        >
          <b-spinner small v-if="deleting" />
          <span v-else>Remove progress</span>
        </b-button>

        <div>
          <b-button
            v-if="!saving"
            variant="success"
            @click="markAsCompleted"
          >
            Mark as completed
          </b-button>

          <b-button
            variant="primary"
            :disabled="saving"
            @click="saveProgress"
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
      localProgress: 0,
      saving: false,
      deleting: false,
    };
  },

  computed: {
    ...mapState(['progresses']),
    ...mapGetters(['nightMode']),

    title() {
      return this.localProgress
        ? 'Update progress'
        : 'Set progress';
    },
  },

  mounted() {
    this.setGameProgress();
  },

  methods: {
    markAsCompleted() {
      this.localProgress = 100;

      this.saveProgress();
    },

    show() {
      this.setGameProgress();
      this.saving = false;
      this.deleting = false;
    },

    setGameProgress() {
      const { id } = this.game;

      this.localProgress = this.progresses[id]
        ? JSON.parse(JSON.stringify(this.progresses[id]))
        : 0;
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
          this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
        });

      this.$bvToast.toast('Progress updated', { title: `${name} progress`, variant: 'success' });
      this.$bvModal.hide('progress');
    },
  },
};
</script>
