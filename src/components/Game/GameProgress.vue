<template lang="html">
  <b-dropdown-item
    v-b-modal.progress
    v-shortkey="['p']"
    @shortkey.native="$bvModal.show('progress');"
  >
    <i class="fas fa-stopwatch fa-fw" />

    {{ title }}

    <b-modal
      id="progress"
      hide-footer
      footer-class="d-flex justify-content-between pt-0"
      @show="show"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('progresses.modalTitle')"
          :subtitle="game.name"
          @close="close"
        >
          <template v-slot:header>
            <b-img
              :src="activeGameCoverUrl"
              :alt="game.name"
              class="float-left mr-2"
              height="40"
              rounded
            />
          </template>

          <b-dropdown
            id="dropdown-1"
            text="Dropdown Button"
            right
          >
            <template v-slot:button-content>
              <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
            </template>

            <b-dropdown-item
              v-if="!saving"
              variant="success"
              @click="markAsCompleted"
            >
              <i class="fas fa-check fa-fw" aria-hidden />
              Mark as completed
            </b-dropdown-item>

            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-item-button
              :disabled="deleting"
              variant="danger"
              @click="deleteProgress"
            >
              <i class="fas fa-trash fa-fw" aria-hidden />
              Remove progress
            </b-dropdown-item-button>
          </b-dropdown>

          <b-button
            variant="primary"
            :disabled="saving"
            @click="saveProgress"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>
        </modal-header>
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
    ...mapGetters(['activeGameCoverUrl']),

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
