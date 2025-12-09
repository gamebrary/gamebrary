<template lang="html">
  <AppSidebar
    id="profile-sidebar"
    :visible="editProfileSidebarOpen"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="loadProfile"
    @hidden="handleHidden"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit Profile" />
    </template>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form
      v-else-if="profile"
      class="px-3 pb-3"
      @submit.prevent="saveAndClose"
    >
      <div v-if="uploading" class="d-flex justify-content-center mb-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Uploading...</span>
        </div>
      </div>

      <div
        class="text-center d-flex flex-column p-3 mb-3 rounded position-relative"
        :class="darkTheme ? 'bg-black' : 'bg-white'"
        :style="style"
      >
        <div class="dropdown position-absolute pe-3" style="right: 0">
          <button
            class="btn dropdown-toggle"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            type="button"
            id="profileMenuDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa-solid fa-bars" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenuDropdown">
            <li><h6 class="dropdown-header">Profile wallpaper</h6></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="toggleWallpaperSidebar">
                {{ wallpaperImage ? 'Change wallpaper' : 'Set profile wallpaper' }}
              </a>
            </li>
            <li v-if="wallpaperImage">
              <a class="dropdown-item" href="#" @click.prevent="removeWallpaper">Remove wallpaper</a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><h6 class="dropdown-header">Profile avatar</h6></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="triggerFileUpload">
                {{ profile.avatar ? 'Replace avatar' : 'Upload avatar' }}
              </a>
            </li>
            <li v-if="avatarImage && profile.avatar">
              <a class="dropdown-item" href="#" @click.prevent="removeAvatar">Remove avatar</a>
            </li>
          </ul>
        </div>

        <img
          v-if="avatarImage"
          :src="avatarImage"
          class="mx-auto cursor-pointer mb-2 rounded-circle"
          style="width: 120px; height: 120px; object-fit: cover; cursor: pointer;"
          @click="triggerFileUpload"
          alt="Avatar"
        />
        <div
          v-else
          class="mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center"
          style="width: 120px; height: 120px; background-color: var(--bs-gray-300); cursor: pointer;"
          @click="triggerFileUpload"
        >
          <i class="fa-regular fa-user fa-3x"></i>
        </div>

        <strong>@{{ profile.userName }}</strong>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="d-none file-input"
        accept="image/*"
        @change="uploadProfileAvatar"
      />

      <div class="mb-3">
        <label for="name" class="form-label m-0 text-muted">Name</label>
        <input
          id="name"
          type="text"
          v-model="profile.name"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label m-0 text-muted">About you</label>
        <input
          id="bio"
          type="text"
          v-model="profile.bio"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="location" class="form-label m-0 text-muted">Location</label>
        <input
          id="location"
          type="text"
          v-model="profile.location"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="website" class="form-label m-0 text-muted">Website</label>
        <input
          id="website"
          type="text"
          v-model="profile.website"
          class="form-control mb-3"
          @blur="autoformatWebsite"
        />
      </div>

      <div class="mb-3">
        <label for="x" class="form-label m-0 text-muted">X</label>
        <input
          id="x"
          type="text"
          v-model="profile.twitter"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="friendCode" class="form-label m-0 text-muted">Nintendo Friend Code</label>
        <input
          id="friendCode"
          type="text"
          v-model="profile.friendCode"
          placeholder="SW-8496-9128-4205"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="psnId" class="form-label m-0 text-muted">Playstation online ID</label>
        <input
          id="psnId"
          type="text"
          v-model="profile.psnId"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="steamFriendCode" class="form-label m-0 text-muted">Steam friend code</label>
        <input
          id="steamFriendCode"
          type="text"
          v-model="profile.steamFriendCode"
          class="form-control mb-3"
        />
      </div>

      <div class="mb-3">
        <label for="gamerTag" class="form-label m-0 text-muted">Xbox Gamertag</label>
        <input
          id="gamerTag"
          type="text"
          v-model="profile.gamerTag"
          class="form-control mb-3"
        />
      </div>

      <AppSidebar
        id="boardWallpaper"
        :visible="wallpaperSidebarVisible"
        :placement="sidebarRightProps?.placement || 'end'"
        :bg-variant="sidebarRightProps?.bgVariant"
        :text-variant="sidebarRightProps?.textVariant"
        @update:visible="handleWallpaperVisibilityChange"
      >
        <template #header>
          <SidebarHeader @hide="hideWallpaperSidebar" title="Set profile wallpaper" />
        </template>
        <div class="p-3">
          <WallpapersList
            selectable
            @select="selectWallpaper"
          />
        </div>
      </AppSidebar>

      <footer class="my-3">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>Save</span>
        </button>

        <button
          type="button"
          class="btn btn-danger ms-2"
          :disabled="deleting"
          @click="confirmDeleteProfile"
        >
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>Delete profile</span>
        </button>
      </footer>
    </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getImageThumbnail } from '@/utils';
import WallpapersList from '@/components/WallpapersList';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Template refs
const fileInput = ref(null);

// Reactive state
const saving = ref(false);
const avatarImage = ref(null);
const wallpaperImage = ref(null);
const loading = ref(false);
const deleting = ref(false);
const uploading = ref(false);
const profile = ref(null);
const wallpaperSidebarVisible = ref(false);

// Store state and getters
const user = computed(() => store.state.user);
const editProfileSidebarOpen = computed(() => store.state.editProfileSidebarOpen);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const style = computed(() => {
  return wallpaperImage.value
    ? `background-image: url('${wallpaperImage.value}'); background-size: cover;`
    : null;
});

// Methods
const handleVisibilityChange = (visible) => {
  store.commit('SET_PROFILE_SIDEBAR_OPEN', visible);
};

const handleHidden = () => {
  store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
};

const handleWallpaperVisibilityChange = (visible) => {
  wallpaperSidebarVisible.value = visible;
};

const hideSidebar = () => {
  store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
};

const hideWallpaperSidebar = () => {
  wallpaperSidebarVisible.value = false;
};

const toggleWallpaperSidebar = () => {
  if ($bus) {
    $bus.$emit('bv::toggle::collapse', 'boardWallpaper');
  }
};

const selectWallpaper = async (wallpaper) => {
  if (!profile.value) return;

  profile.value.wallpaper = wallpaper;
  hideWallpaperSidebar();
  wallpaperImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', wallpaper);
  save();
};

const autoformatWebsite = () => {
  if (!profile.value?.website) return;

  const website = profile.value.website;
  if (website && !/^https?:\/\//i.test(website)) {
    profile.value.website = `https://${website}`;
  }
};

const loadProfile = async () => {
  loading.value = profile.value === null;

  try {
    profile.value = await store.dispatch('LOAD_PROFILE');

    if (profile.value?.avatar) {
      await loadAvatarImage();
    } else {
      resetAvatar();
    }

    if (profile.value?.wallpaper) {
      await loadWallpaper();
    } else {
      resetWallpaper();
    }
  } catch (e) {
    profile.value = null;
  } finally {
    loading.value = false;
  }
};

const loadAvatarImage = async () => {
  if (!profile.value?.avatar) return;

  try {
    const thumbnailRef = getImageThumbnail(profile.value.avatar);
    avatarImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
  } catch (e) {
    save();
  }
};

const loadWallpaper = async () => {
  if (!profile.value?.wallpaper) return;

  try {
    wallpaperImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', profile.value.wallpaper);
  } catch (e) {
    save();
  }
};

const resetWallpaper = () => {
  wallpaperImage.value = null;
  if (profile.value) {
    profile.value.wallpaper = null;
  }
};

const resetAvatar = () => {
  avatarImage.value = null;
  if (profile.value) {
    profile.value.avatar = null;
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const uploadProfileAvatar = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file || !profile.value) return;

  uploading.value = true;

  try {
    profile.value.avatar = await store.dispatch('UPLOAD_PROFILE_AVATAR', file);
    save();
    avatarImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', profile.value.avatar);
  } catch (e) {
    showToast('There was an error uploading avatar', 'danger');
  } finally {
    uploading.value = false;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const removeWallpaper = async () => {
  resetWallpaper();
  save();
};

const removeAvatar = async () => {
  resetAvatar();
  save();
};

const saveAndClose = async () => {
  try {
    saving.value = true;
    await store.dispatch('SAVE_PROFILE', profile.value);
    store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
    if (!profile.value?.wallpaper && $bus) {
      $bus.$emit('CLEAR_WALLPAPER');
    }
    if ($bus) {
      $bus.$emit('LOAD_PROFILE');
    }
  } catch (error) {
    // Error handling
  } finally {
    saving.value = false;
  }
};

const save = async () => {
  if (!profile.value) return;

  try {
    saving.value = true;
    await store.dispatch('SAVE_PROFILE', profile.value);
    if (!profile.value.wallpaper && $bus) {
      $bus.$emit('CLEAR_WALLPAPER');
    }
    if ($bus) {
      $bus.$emit('LOAD_PROFILE');
    }
  } catch (error) {
    // Error handling
  } finally {
    saving.value = false;
  }
};

const confirmDeleteProfile = async () => {
  const confirmed = window.confirm('Are you sure?');
  if (confirmed) {
    deleting.value = true;
    try {
      await store.dispatch('DELETE_PROFILE');
      router.replace({ name: 'create.profile' });
    } finally {
      deleting.value = false;
    }
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

// Lifecycle hooks
onMounted(() => {
  loadProfile();
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'profile-sidebar') {
        store.commit('SET_PROFILE_SIDEBAR_OPEN', !editProfileSidebarOpen.value);
      } else if (id === 'boardWallpaper') {
        wallpaperSidebarVisible.value = !wallpaperSidebarVisible.value;
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
