<template>
  <div class="settings-page">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <h1 class="mb-4">Settings</h1>

          <!-- Appearance Section -->
          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Appearance</h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="darkTheme"
                  @change="toggleTheme"
                  id="darkThemeSwitch"
                />
                <label class="form-check-label" for="darkThemeSwitch">
                  Dark theme
                </label>
              </div>

              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="transparencyEnabled"
                  @change="toggleTransparency"
                  id="transparencySwitch"
                />
                <label class="form-check-label" for="transparencySwitch">
                  Transparency
                </label>
              </div>

            </div>
          </div>

          <!-- Game Display Section -->
          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Game Display</h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="showGameThumbnails"
                  @change="toggleGameThumbnails"
                  id="gameThumbnailsSwitch"
                />
                <label class="form-check-label" for="gameThumbnailsSwitch">
                  Game covers in board preview
                </label>
              </div>

              <div class="mb-3">
                <label class="form-label">Preferred age rating</label>
                <select
                  class="form-select"
                  :value="ageRating"
                  @change="setPreferredGameRating($event.target.value)"
                >
                  <option
                    v-for="option in ageRatingOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Account Section -->
          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Account</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button
                  type="button"
                  class="btn"
                  :class="darkTheme ? 'btn-outline-light' : 'btn-outline-dark'"
                  @click="signOut"
                >
                  <i class="fa-regular fa-right-from-bracket fa-fw" />
                  Sign out
                </button>

                <a
                  href="https://accounts.google.com/"
                  class="btn btn-info"
                  target="_blank"
                >
                  <i class="fa-regular fa-user fa-fw" />
                  Manage account
                </a>

                <button
                  type="button"
                  class="btn btn-danger"
                  @click="openDeleteAccountModal"
                >
                  <i class="fa-regular fa-trash-can fa-fw" />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <DeleteAccountModal />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import { AGE_RATINGS } from '@/constants';

const router = useRouter();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const { darkTheme, showGameThumbnails, transparencyEnabled, ageRating } = useAppGetters();

// Store state and getters
const settings = computed(() => settingsStore.settings);

// Computed properties
const ageRatingOptions = computed(() => {
  return AGE_RATINGS.map((rating) => ({
    value: rating.id,
    text: rating.name,
  }));
});

// Methods
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

const setPreferredGameRating = async (ageRatingValue) => {
  try {
    await settingsStore.saveSettings(userStore.user.uid, {
      ...settings.value,
      ageRating: ageRatingValue,
    });
    showToast('Settings saved', 'success');
  } catch (e) {
    showToast('There was an error saving your settings', 'danger');
  }
};

const toggleTheme = async () => {
  const currentDarkTheme = settings.value?.darkTheme || false;

  const payload = {
    ...settings.value,
    darkTheme: !currentDarkTheme,
  };

  await settingsStore.saveSettings(userStore.user.uid, payload)
    .then(() => {
      showToast('Settings saved', 'success');
    })
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
    });
};

const toggleGameThumbnails = async () => {
  const currentShowGameThumbnails = settings.value?.showGameThumbnails || false;

  const payload = {
    ...settings.value,
    showGameThumbnails: !currentShowGameThumbnails,
  };

  await settingsStore.saveSettings(userStore.user.uid, payload)
    .then(() => {
      showToast('Settings saved', 'success');
    })
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
    });
};


const toggleTransparency = async () => {
  const currentTransparencyEnabled = settings.value?.transparencyEnabled || false;

  const payload = {
    ...settings.value,
    transparencyEnabled: !currentTransparencyEnabled,
  };

  await settingsStore.saveSettings(userStore.user.uid, payload)
    .then(() => {
      showToast('Settings saved', 'success');
    })
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
    });
};

const signOut = async () => {
  await userStore.signOut();
  showToast('Logged out', 'success');
  userStore.clearSession();
  router.replace({ name: 'home' });
};

const openDeleteAccountModal = () => {
  const modalElement = document.getElementById('delete-account-modal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
  }
};
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100%;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.125);

  .card-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  }
}

.bg-dark {
  .card {
    border-color: rgba(255, 255, 255, 0.125);

    .card-header {
      border-bottom-color: rgba(255, 255, 255, 0.125);
    }
  }
}
</style>

