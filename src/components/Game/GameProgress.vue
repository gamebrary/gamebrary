<template lang="html">
  <div v-if="user">
    <div class="alert text-center" role="alert" :class="alertClass">
      <div v-if="progress === 0 || !progress" class="mb-2">
        Track your game progress!
      </div>

      <div v-else class="d-flex align-items-center text-center mb-1">
        <i v-if="progress >= 100" class="fa-sharp fa-solid fa-trophy-star text-warning me-1" />

        <span :class="{ 'text-warning': progress >= 100 }">
          {{ progress }}% Completed
        </span>

        <button
          v-if="progress"
          type="button"
          class="btn ms-auto"
          :class="darkTheme ? 'btn-dark' : 'btn-light'"
          style="background: transparent; border: none;"
          :disabled="deleting"
          @click="deleteProgress"
        >
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else class="fas fa-trash" aria-hidden />
        </button>
      </div>

      <input
        v-if="showProgressBar || progress"
        v-model="progress"
        type="range"
        class="form-range progress-bar px-2 bg-light"
        max="100"
        step="1"
        @input="debounceSaveProgress"
      />

      <button v-else type="button" class="btn btn-success" @click="showProgressBar = true">
        Get started
      </button>
    </div>
  </div>

  <div v-else>
    <p>Track your game progress!</p>

    <router-link
      :to="{ name: 'auth' }"
      class="btn btn-secondary mt-2"
    >
      Get started
    </router-link>
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
      saveTimeout: null,
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

    debounceSaveProgress() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(() => {
        this.saveProgress();
      }, 500);
    },

    async deleteProgress() {
      try {
        const { id, name } = this.game;

        this.showProgressBar = false;

        this.deleting = true;

        this.$store.commit('REMOVE_GAME_PROGRESS', id);

        await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE');
        this.progress = 0;
        this.showToast('Progress deleted', 'success');
      } catch (e) {
        this.showToast('There was an error deleting your progress', 'danger');
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

        // this.showToast('Progress saved');
      } catch (e) {
        this.saving = false;
        // this.showToast('There was an error saving your progress', 'danger');
      }

      this.saving = false;
    },

    showToast(message, variant = 'info') {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
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
