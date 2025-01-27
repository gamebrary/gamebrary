<template lang="html">
  <div v-if="user">
    <div class="alert text-center" role="alert" :class="alertClass">
      <div v-if="progress === 0 || !progress" class="mb-2">
        Track your game progress!
      </div>

      <div v-else class="d-flex align-items-center text-center mb-1">
        <i v-if="progress >= 100" class="fa-sharp fa-solid fa-trophy-star text-warning mr-1" />

        <span :class="{ 'text-warning': progress >= 100 }">
          {{ progress }}% Completed
        </span>

        <b-button
          v-if="progress"
          :disabled="deleting"
          variant="transparent"
          class="ml-auto"
          size="sm"
          @click="deleteProgress"
        >
          <b-spinner small v-if="deleting" />
          <i v-else class="fas fa-trash" aria-hidden />
        </b-button>
      </div>

      <b-form-input
        v-if="showProgressBar || progress"
        v-model="progress"
        type="range"
        class="progress-bar px-2 bg-light"
        max="100"
        step="1"
        debounce="500"
        @update="saveProgress"
      />

      <b-button v-else variant="success" @click="showProgressBar = true">
        Get started
      </b-button>
    </div>
  </div>

  <div v-else>
    <p>Track your game progress!</p>

    <b-button
      variant="secondary"
      :to="{ name: 'auth' }"
      class="mt-2"
    >
      Get started
    </b-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      progress: 0,
      saving: false,
      deleting: false,
      showProgressBar: false,
    }
  },

  computed: {
    ...mapState(['progresses', 'game', 'user']),
    ...mapGetters(['darkTheme']),

    progressClass() {
      if (this.progress === 0) return 'bg-white';
      if (this.progress < 90) return 'bg-secondary';

      return 'bg-success';
    },

    alertClass() {
      if (this.darkTheme) return 'alert-dark';

      if (!this.progress) return 'alert-muted';
      if (this.progress === 0) return 'alert-muted';
      if (this.progress < 25) return 'alert-info';
      if (this.progress < 50) return 'alert-warning';
      if (this.progress < 75) return 'alert-primary';
      if (this.progress < 90) return 'alert-success';

      return 'alert-warning';
    },
  },

  watch: {
      game(game) {
        if (game?.id) this.setProgress();
      },
  },

  mounted() {
    this.setProgress();
  },

  methods: {
    setProgress() {
      this.progress = this.progresses?.[this.game?.id]
        ? JSON.parse(JSON.stringify(this.progresses?.[this.game?.id]))
        : 0;
    },

    async deleteProgress() {
      try {
        const { id, name } = this.game;

        this.showProgressBar = false;

        this.deleting = true;

        this.$store.commit('REMOVE_GAME_PROGRESS', id);

        await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE');
        this.progress = 0;
        this.$bvToast.toast('Progress deleted');
      } catch (e) {
        this.$bvToast.toast('There was an error deleting your progress', { variant: 'error' });
      }

      this.deleting = false;
    },

    async saveProgress() {
      try {
        this.saving = true;

        this.$store.commit('SET_GAME_PROGRESS', {
          progress: this.progress,
          gameId: this.game?.id,
        });

        await this.$store.dispatch('SAVE_PROGRESSES');

        // this.$bvToast.toast('Progress saved');
      } catch (e) {
        this.saving = false;
        // this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
      }

      this.saving = false;
    },
  },
};
</script>

<style scoped>
.progress-bar {
  position: relative;
  height: 24px;
  border-radius: 4px;

  /* box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); */
}
</style>