<template lang="html">
  <AppSidebar
    id="profile-sidebar"
    :visible="editProfileSidebarOpen"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="loadProfile"
    @hidden="$store.commit('SET_PROFILE_SIDEBAR_OPEN', false)"
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
              <a class="dropdown-item" href="#" @click.prevent="$root.$emit('bv::toggle::collapse', 'boardWallpaper')">
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

<script>
import { getImageThumbnail } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import WallpapersList from '@/components/WallpapersList';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';

export default {
  components: {
    AppSidebar,
    WallpapersList,
    SidebarHeader,
  },

  data() {
    return {
      saving: false,
      avatarImage: null,
      wallpaperImage: null,
      loading: false,
      deleting: false,
      uploading: false,
      profile: null,
      wallpaperSidebarVisible: false,
    };
  },

  mounted() {
    this.loadProfile();
    // Listen for sidebar toggle events
    this.$root.$on('bv::toggle::collapse', (id) => {
      if (id === 'profile-sidebar') {
        this.$store.commit('SET_PROFILE_SIDEBAR_OPEN', !this.editProfileSidebarOpen);
      } else if (id === 'boardWallpaper') {
        this.wallpaperSidebarVisible = !this.wallpaperSidebarVisible;
      }
    });
  },

  beforeUnmount() {
    this.$root.$off('bv::toggle::collapse');
  },

  computed: {
    ...mapState(['user', 'editProfileSidebarOpen']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    style() {
      return this.wallpaperImage
        ? `background-image: url('${this.wallpaperImage}'); background-size: cover;`
        : null;
    },
  },

  methods: {
    handleVisibilityChange(visible) {
      this.$store.commit('SET_PROFILE_SIDEBAR_OPEN', visible);
    },

    handleWallpaperVisibilityChange(visible) {
      this.wallpaperSidebarVisible = visible;
    },

    hideSidebar() {
      this.$store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
    },

    hideWallpaperSidebar() {
      this.wallpaperSidebarVisible = false;
    },

    async selectWallpaper(wallpaper) {
      this.profile.wallpaper = wallpaper;
      this.hideWallpaperSidebar();
      this.wallpaperImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', wallpaper);
      this.save();
    },

    autoformatWebsite() {
      const website = this.profile?.website;

      if (website && !/^https?:\/\//i.test(website)) {
        this.profile.website = `https://${website}`;
      }
    },

    async loadProfile() {
      this.loading = this.profile === null;

      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => null);

      if (this.profile?.avatar) {
        this.loadAvatarImage()
      } else {
        this.resetAvatar();
      }

      if (this.profile?.wallpaper) {
        this.loadWallpaper();
      } else {
        this.resetWallpaper();
      }

      this.loading = false;
    },

    async loadAvatarImage() {
      try {
        const thumbnailRef = getImageThumbnail(this.profile?.avatar);

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
      } catch (e) {
        this.save();
      }
    },

    async loadWallpaper() {
      try {
        this.wallpaperImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile?.wallpaper);
      } catch (e) {
        this.save();
      }
    },

    resetWallpaper() {
      this.wallpaperImage = null;
      this.profile.wallpaper = null;
    },

    resetAvatar() {
      this.avatarImage = null;
      this.profile.avatar = null;
    },

    triggerFileUpload() {
      this.$refs.fileInput?.click();
    },

    async uploadProfileAvatar(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;

      this.uploading = true;

      try {
        this.profile.avatar = await this.$store.dispatch('UPLOAD_PROFILE_AVATAR', file);

        this.save();

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile.avatar);
      } catch (e) {
        this.showToast('There was an error uploading avatar', 'danger');
      }

      this.uploading = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    async removeWallpaper() {
      this.resetWallpaper();
      this.save();
    },

    async removeAvatar() {
      this.resetAvatar();
      this.save();
    },

    async saveAndClose() {
      try {
        this.saving = true;

        await this.$store.dispatch('SAVE_PROFILE', this.profile);

        this.saving = false;
        this.$store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
        if (!this.profile.wallpaper) this.$bus.$emit('CLEAR_WALLPAPER');
        this.$bus.$emit('LOAD_PROFILE');
      } catch (error) {
        this.saving = false;
      }
    },

    async save() {
      try {
        this.saving = true;

        await this.$store.dispatch('SAVE_PROFILE', this.profile);

        this.saving = false;
        if (!this.profile.wallpaper) this.$bus.$emit('CLEAR_WALLPAPER');
        this.$bus.$emit('LOAD_PROFILE');
      } catch (error) {
        this.saving = false;
      }
    },

    async confirmDeleteProfile() {
      const confirmed = window.confirm('Are you sure?');
      if (confirmed) {
        this.deleting = true;
        await this.$store.dispatch('DELETE_PROFILE');
        this.$router.replace({ name: 'create.profile' });
      }
      this.deleting = false;
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
