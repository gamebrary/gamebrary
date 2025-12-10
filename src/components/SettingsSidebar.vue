<template lang="html">
  <AppSidebar id="settings-sidebar" :visible="visible" :placement="sidebarLeftProps?.placement || 'start'"
    :bg-variant="sidebarLeftProps?.bgVariant" :text-variant="sidebarLeftProps?.textVariant" :z-index="2001"
    @update:visible="handleVisibilityChange">
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Settings" />
    </template>

    <div class="p-3">
      <div class="form-check form-switch mb-1">
        <input class="form-check-input" type="checkbox" :checked="darkTheme" @change="toggleTheme"
          id="darkThemeSwitch" />
        <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="darkThemeSwitch">
          Dark theme
        </label>
      </div>

      <div class="form-check form-switch mb-1">
        <input class="form-check-input" type="checkbox" :checked="showGameThumbnails" @change="toggleGameThumbnails"
          id="gameThumbnailsSwitch" />
        <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="gameThumbnailsSwitch">
          Game covers in board preview
        </label>
      </div>

      <div class="form-check form-switch mb-1">
        <input class="form-check-input" type="checkbox" :checked="transparencyEnabled" @change="toggleTransparency"
          id="transparencySwitch" />
        <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="transparencySwitch">
          Transparency
        </label>
      </div>

      <div class="p-1 mb-1">
        <span :class="darkTheme ? 'text-light' : null">Preferred age rating</span>

        <select class="form-select" :value="ageRating" @change="setPreferredGameRating($event.target.value)">
          <option v-for="option in ageRatingOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>


      <DeleteAccountModal />

      <div class="mt-4 d-inline-flex flex-column">
        <button type="button" class="btn mb-2" :class="darkTheme ? 'btn-dark' : 'btn-light'" @click="signOut">
          <i class="fa-regular fa-right-from-bracket fa-fw" />
          Sign out
        </button>

        <a href="https://accounts.google.com/" class="btn btn-info mb-2" target="_blank">
          Manage account
        </a>

        <a href="#" class="mb-2 text-danger px-3 py-2" @click="openDeleteAccountSidebar">
          Delete account
        </a>
      </div>
    </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import { AGE_RATINGS } from '@/constants';

const router = useRouter();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const { darkTheme, showGameThumbnails, transparencyEnabled, ageRating, sidebarLeftProps } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const visible = ref(false);
const saving = ref(false);

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
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
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

const setPreferredGameRating = async (ageRatingValue) => {
  try {
    await settingsStore.saveSettings({
      ...settings.value,
      ageRating: ageRatingValue,
    });
  } catch (e) {
    showToast('There was an error saving your settings', 'danger');
  }

  saving.value = false;
};

const toggleTheme = async () => {
  const currentDarkTheme = settings.value?.darkTheme || false;

  const payload = {
    ...settings.value,
    darkTheme: !currentDarkTheme,
  };

  await settingsStore.saveSettings(payload)
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
      saving.value = false;
    });
};

const signOut = async () => {
  await userStore.signOut();
  showToast('Logged out', 'success');
  userStore.clearSession();
  router.replace({ name: 'home' });
};

const toggleGameThumbnails = async () => {
  const currentShowGameThumbnails = settings.value?.showGameThumbnails || false;

  const payload = {
    ...settings.value,
    showGameThumbnails: !currentShowGameThumbnails,
  };

  await settingsStore.saveSettings(payload)
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
      saving.value = false;
    });
};


const toggleTransparency = async () => {
  const currentTransparencyEnabled = settings.value?.transparencyEnabled || false;

  const payload = {
    ...settings.value,
    transparencyEnabled: !currentTransparencyEnabled,
  };

  await settingsStore.saveSettings(payload)
    .catch(() => {
      showToast('There was an error saving your settings', 'danger');
      saving.value = false;
    });
};

const openDeleteAccountSidebar = () => {
  hideSidebar();
  const modalElement = document.getElementById('delete-account-modal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
  }
};

// Lifecycle hooks
onMounted(() => {
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'settings-sidebar') {
        visible.value = !visible.value;
      }
    });
  }
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('bv::toggle::collapse');
  }
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
