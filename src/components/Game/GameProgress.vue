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

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useProgressesStore } from '@/stores/progresses';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';

const progressesStore = useProgressesStore();
const gamesStore = useGamesStore();
const userStore = useUserStore();
const { darkTheme } = useAppGetters();

// Reactive state
const progress = ref(0);
const saving = ref(false);
const deleting = ref(false);
const showProgressBar = ref(false);
const saveTimeout = ref(null);

// Store state and getters
const progresses = computed(() => progressesStore.progresses);
const game = computed(() => gamesStore.game);
const user = computed(() => userStore.user);

// Computed properties
const progressClass = computed(() => {
  if (progress.value === 0) return 'bg-white';
  if (progress.value < 90) return 'bg-secondary';

  return 'bg-success';
});

const alertClass = computed(() => {
  if (darkTheme.value) return 'alert-dark';

  if (!progress.value) return 'alert-muted';
  if (progress.value === 0) return 'alert-muted';
  if (progress.value < 25) return 'alert-info';
  if (progress.value < 50) return 'alert-warning';
  if (progress.value < 75) return 'alert-primary';
  if (progress.value < 90) return 'alert-success';

  return 'alert-warning';
});

// Methods
const setProgress = () => {
  progress.value = progresses.value?.[game.value?.id]
    ? JSON.parse(JSON.stringify(progresses.value?.[game.value?.id]))
    : 0;
};

const debounceSaveProgress = () => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
  saveTimeout.value = setTimeout(() => {
    saveProgress();
  }, 500);
};

const deleteProgress = async () => {
  try {
    const { id } = game.value;

    showProgressBar.value = false;

    deleting.value = true;

    progressesStore.removeGameProgress(id);

    await progressesStore.saveProgressesNoMerge(userStore.user.uid);
    progress.value = 0;
    showToast('Progress deleted', 'success');
  } catch (e) {
    showToast('There was an error deleting your progress', 'danger');
  } finally {
    deleting.value = false;
  }
};

const saveProgress = async () => {
  try {
    saving.value = true;

    progressesStore.setGameProgress({
      progress: progress.value,
      gameId: game.value?.id,
    });

    await progressesStore.saveProgresses(userStore.user.uid);

    // Progress saved silently
  } catch (e) {
    // Error handling
  } finally {
    saving.value = false;
  }
};

const showToast = (message, variant = 'info') => {
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
};

// Watchers
watch(() => game.value, (newGame) => {
  if (newGame?.id) setProgress();
});

// Lifecycle hooks
onMounted(() => {
  setProgress();
});

onBeforeUnmount(() => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
});
</script>

<style scoped>
.progress-bar {
  position: relative;
  height: 24px;
  border-radius: 4px;

  /* box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); */
}
</style>
