<template lang="html">
  <b-sidebar
    id="profile-sidebar"
    :visible="editProfileSidebarOpen"
    v-bind="sidebarRightProps"
    @shown="loadProfile"
    @hidden="$store.commit('SET_PROFILE_SIDEBAR_OPEN', false)"
    >
      <template #default="{ hide }">
        <SidebarHeader @hide="hide" title="Edit Profile" />

        <b-spinner v-if="loading" class="spinner-centered" />

        <b-form
          v-else-if="profile"
          class="px-3 pb-3"
          @submit.prevent="saveAndClose"
        >
          <b-spinner v-if="uploading" />

          <div
            class="text-center d-flex flex-column p-3 mb-3 rounded position-relative"
            :class="darkTheme ? 'bg-black' : 'bg-white'"
            :style="style"
          >
            <b-dropdown
              no-caret
              class="position-absolute pr-3"
              style="right: 0"
              :variant="darkTheme ? 'dark' : 'white'"
            >
              <template #button-content>
                <i class="fa-solid fa-bars" />
              </template>

              <b-dropdown-header id="dropdown-header-label">
                Profile wallpaper
              </b-dropdown-header>

              <b-dropdown-item v-b-toggle.boardWallpaper>
                {{ wallpaperImage ? 'Change wallpaper' : 'Set profile wallpaper' }}
              </b-dropdown-item>

              <b-dropdown-item
                v-if="wallpaperImage"
                @click="removeWallpaper"
              >
                Remove wallpaper
              </b-dropdown-item>

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-header id="dropdown-header-label">
                Profile avatar
              </b-dropdown-header>

              <b-dropdown-item @click="triggerFileUpload">
                {{ profile.avatar ? 'Replace avatar' : 'Upload avatar' }}
              </b-dropdown-item>
              <b-dropdown-item v-if="avatarImage && profile.avatar" @click="removeAvatar">Remove avatar</b-dropdown-item>
            </b-dropdown>

            <b-avatar
              :src="avatarImage"
              class="mx-auto cursor-pointer mb-2"
              size="120"
              @click.native="triggerFileUpload"
            />

            <strong>@{{ profile.userName }}</strong>
          </div>

          <b-form-file
            class="d-none file-input"
            v-model="file"
            accept="image/*"
            @input="uploadProfileAvatar"
          />

          <b-form-group
            label-class="m-0 text-muted"
            label="Name"
            label-for="name"
          >
            <b-form-input
              id="name"
              v-model="profile.name"
              class="mb-3"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="About you"
            label-for="bio"
          >
            <b-form-input
              id="bio"
              v-model="profile.bio"
              class="mb-3"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="Location"
            label-for="location"
          >
            <b-form-input
              id="location"
              v-model="profile.location"
              class="mb-3"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="Website"
            label-for="website"
          >
            <b-form-input
              id="website"
              v-model="profile.website"
              class="mb-3"
              @blur="autoformatWebsite"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="X"
            label-for="x"
          >
            <b-form-input
              id="x"
              v-model="profile.twitter"
              class="mb-3"
            />
          </b-form-group>


          <b-form-group
            label-class="m-0 text-muted"
            label="Nintendo Friend Code"
            label-for="friendCode"
          >
            <b-form-input
              id="friendCode"
              v-model="profile.friendCode"
              placeholder="SW-8496-9128-4205"
              class="mb-3"
            />
          </b-form-group>


          <!-- Validate -->
          <!-- Between 3 and 16 characters -->
          <!-- Starts with a letter -->
          <!-- No spaces -->
          <!-- Only letters, digits, underscores & hyphens -->

          <b-form-group
            label-class="m-0 text-muted"
            label="Playstation online ID"
            label-for="psnId"
          >
            <b-form-input
              id="psnId"
              v-model="profile.psnId"
              class="mb-3"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="Steam friend code"
            label-for="steamFriendCode"
          >
            <b-form-input
              id="steamFriendCode"
              v-model="profile.steamFriendCode"
              class="mb-3"
            />
          </b-form-group>

          <b-form-group
            label-class="m-0 text-muted"
            label="Xbox Gamertag"
            label-for="gamerTag"
          >
            <b-form-input
              id="gamerTag"
              v-model="profile.gamerTag"
              class="mb-3"
            />
          </b-form-group>

          <b-sidebar
            id="boardWallpaper"
            v-bind="sidebarRightProps"
            right
          >
          <template #default="{ hide }">
            <SidebarHeader @hide="hide" title="Set profile wallpaper" />

            <div class="p-3">
              <WallpapersList
                selectable
                @select="selectWallpaper"
              />
            </div>
          </template>


              <!-- :selected="board.backgroundUrl" -->
          </b-sidebar>

          <footer class="my-3">
            <b-button
              variant="primary"
              type="submit"
            >
              <b-spinner small v-if="saving" />
              <template v-else>Save</template>
            </b-button>

            <b-button
              class="ml-2"
              variant="danger"
              :disabled="deleting"
              @click="confirmDeleteProfile"
            >
              <b-spinner small v-if="deleting" />
              <template v-else>Delete profile</template>
            </b-button>
          </footer>
        </b-form>
      </template>
  </b-sidebar>
</template>

<script>
import { getImageThumbnail } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import WallpapersList from '@/components/WallpapersList';
import SidebarHeader from '@/components/SidebarHeader';

export default {
  components: {
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
      file: null,
    };
  },

  mounted() {
    this.loadProfile();
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
    async selectWallpaper(wallpaper) {
      this.profile.wallpaper = wallpaper;

      this.$root.$emit('bv::toggle::collapse', 'boardWallpaper');
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
      document.querySelector('.file-input input').click();
    },

    async uploadProfileAvatar() {
      if (!this.file) return;

      this.uploading = true;

      try {
        this.profile.avatar = await this.$store.dispatch('UPLOAD_PROFILE_AVATAR', this.file);

        this.save();

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile.avatar);
      } catch (e) {
        this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
      }

      this.uploading = false;
      this.file = null;
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
        //
      }
    },

    async confirmDeleteProfile() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure?')
        .catch(() => {});

      if (confirmed) {
        this.deleting = true;
        await this.$store.dispatch('DELETE_PROFILE');

        this.$router.replace({ name: 'create.profile' });
      }

      this.deleting = false;
    },
  },
};
</script>
