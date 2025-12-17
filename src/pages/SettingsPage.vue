<template>
  <div class="settings-page">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <h1 class="mb-4">Settings</h1>

          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Appearance</h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" :checked="darkTheme" @change="toggleTheme"
                  id="darkThemeSwitch" />
                <label class="form-check-label" for="darkThemeSwitch">
                  Dark theme
                </label>
              </div>

              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" :checked="transparencyEnabled"
                  @change="toggleTransparency" id="transparencySwitch" />
                <label class="form-check-label" for="transparencySwitch">
                  Transparency
                </label>
              </div>

            </div>
          </div>

          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Game Display</h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" :checked="showGameThumbnails"
                  @change="toggleGameThumbnails" id="gameThumbnailsSwitch" />
                <label class="form-check-label" for="gameThumbnailsSwitch">
                  Game covers in board preview
                </label>
              </div>

              <div class="mb-3">
                <label class="form-label">Preferred age rating</label>
                <select class="form-select" :value="ageRating" @change="setPreferredGameRating($event.target.value)">
                  <option v-for="option in ageRatingOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Tags</h5>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                Manage your tags. Use tags to filter games in your Library.
              </p>

              <div v-if="tags.length === 0" class="text-center py-4">
                <p class="text-muted">No tags yet. Create your first tag to get started!</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="offcanvas"
                  data-bs-target="#create-tag-sidebar">
                  Create tag
                </button>
              </div>

              <div v-else>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted small">{{ tags.length }} tag{{ tags.length !== 1 ? 's' : '' }}</span>
                  <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="offcanvas"
                    data-bs-target="#create-tag-sidebar">
                    <PhPlus :size="14" weight="fill" class="me-1" />
                    Create tag
                  </button>
                </div>

                <div class="list-group">
                  <div v-for="(tag, index) in tags" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    :class="darkTheme ? 'bg-dark text-light border-secondary' : ''">
                    <div class="d-flex align-items-center gap-2 flex-grow-1">
                      <button type="button" class="btn btn-sm"
                        :style="`background-color: ${tag.bgColor}; color: ${tag.textColor};`" @click="editTag(index)">
                        {{ tag.name }}
                      </button>
                      <span class="badge bg-secondary rounded-pill">
                        {{ tag.games?.length || 0 }} game{{ (tag.games?.length || 0) !== 1 ? 's' : '' }}
                      </span>
                    </div>

                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-sm"
                        :class="darkTheme ? 'btn-outline-light' : 'btn-outline-dark'" @click="editTag(index)"
                        title="Edit tag">
                        <PhPencil :size="14" weight="regular" />
                      </button>
                      <button type="button" class="btn btn-sm btn-danger" @click="deleteTag(index)" title="Delete tag">
                        <PhTrash :size="14" weight="regular" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4" :class="darkTheme ? 'bg-dark text-light' : ''">
            <div class="card-header">
              <h5 class="mb-0">Account</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button type="button" class="btn" :class="darkTheme ? 'btn-outline-light' : 'btn-outline-dark'"
                  @click="signOut">
                  <PhSignOut :size="16" weight="regular" class="me-2" />
                  Sign out
                </button>

                <a href="https://accounts.google.com/" class="btn btn-info" target="_blank">
                  <PhUser :size="16" weight="regular" class="me-2" />
                  Manage account
                </a>

                <button type="button" class="btn btn-danger" @click="openDeleteAccountModal">
                  <PhTrash :size="16" weight="regular" class="me-2" />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DeleteAccountModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { useTagsStore } from '@/stores/tags';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import { AGE_RATINGS } from '@/constants';
import { PhPlus, PhPencil, PhTrash, PhSignOut, PhUser } from '@phosphor-icons/vue';

const router = useRouter();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const tagsStore = useTagsStore();
const uiStore = useUIStore();
const { darkTheme, showGameThumbnails, transparencyEnabled, ageRating } = useAppGetters();

// Store state and getters
const settings = computed(() => settingsStore.settings);
const tags = computed(() => tagsStore.tags || []);

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

const editTag = (index) => {
  uiStore.setActiveTagIndex(index);
  const element = document.getElementById('edit-tag-sidebar');
  if (element) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(element) || new bootstrap.Offcanvas(element);
    bsOffcanvas.show();
  }
};

const deleteTag = async (index) => {
  const tag = tags.value[index];
  const confirmed = window.confirm(
    `Are you sure you want to delete "${tag.name}"? This will remove the tag from all ${tag.games?.length || 0} game${(tag.games?.length || 0) !== 1 ? 's' : ''}.`
  );

  if (confirmed) {
    try {
      tagsStore.removeTag(index);
      await tagsStore.saveTags(userStore.user.uid);
      showToast('Tag deleted', 'success');
    } catch (e) {
      showToast('There was an error deleting the tag', 'danger');
    }
  }
};

// Lifecycle hooks
onMounted(async () => {
  if (userStore.user?.uid && tags.value.length === 0) {
    await tagsStore.loadTags(userStore.user.uid);
  }
});
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
