<!-- TODO: finish layout, hook up remove profile pic -->
<template lang="html">
  <b-sidebar
    id="profile-sidebar"
    scrollable
    right
    shadow
    :visible="editProfileSidebarOpen"
    no-header
    backdrop
    body-class="p-3"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    @hidden="$store.commit('SET_PROFILE_SIDEBAR_OPEN', false)"
  >
    <h3>Edit Profile</h3>

    <b-spinner v-if="loading" class="spinner-centered" />

    <b-form
      v-else-if="profile"
      @submit.prevent="save"
    >
      <b-spinner v-if="uploading" />

      <div class="text-center">
        <b-avatar
          :src="avatarImage"
          class="mx-auto cursor-pointer"
          size="200"
          @click.native="triggerFileUpload"
        />

        <b-link>
          Remove profile picture
        </b-link>

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

      Wallpaper
      <b-img
        v-if="wallpaperImage"
        :src="wallpaperImage"
        rounded
        fluid
        class="mb-3"
      />

      <b-button class="mb-3" v-b-toggle.boardWallpaper>
        {{ wallpaperImage ? 'Change wallpaper' : 'Set wallpaper' }}
      </b-button>

      <b-sidebar
        id="boardWallpaper"
        scrollable
        right
        shadow
        no-header
        backdrop
        body-class="p-3"
        :bg-variant="darkTheme ? 'dark' : 'light'"
        :text-variant="darkTheme ? 'light' : 'dark'"
      >
      <template #default="{ hide }">
        <div class="d-flex align-items-center justify-content-between mb-2 p-3">

          <b-button @click="hide">
            <i class="fa-solid fa-xmark" />
          </b-button>

          <upload-wallpaper-button />
        </div>

        <WallpapersList
          selectable
          @select="selectWallpaper"
        />
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
  </b-sidebar>
</template>

<script>
import { getImageThumbnail } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import WallpapersList from '@/components/WallpapersList';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';

export default {
  components: {
    WallpapersList,
    UploadWallpaperButton,
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
    ...mapGetters(['darkTheme']),
  },

  methods: {
    async selectWallpaper(wallpaper) {
      this.profile.wallpaper = wallpaper;

      this.save();

      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', wallpaper);
    },

    autoformatWebsite() {
      const website = this.profile?.website;

      if (website && !/^https?:\/\//i.test(website)) {
        this.profile.website = `https://${website}`;
      }
    },

    async loadProfile() {
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => null);

      if (this.profile?.avatar) this.loadAvatarImage();
      if (this.profile?.wallpaper) this.loadWallpaper();

      this.loading = false;
    },

    async loadAvatarImage() {
      try {
        const thumbnailRef = getImageThumbnail(this.profile?.avatar);

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
      } catch (e) {
        this.profile.avatar = null;
        this.save();
      }
    },

    async loadWallpaper() {
      try {
        this.wallpaperImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile?.wallpaper);
      } catch (e) {
        this.profile.avatar = null;
        this.save();
      }
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

    async save() {
      try {
        this.saving = true;

        await this.$store.dispatch('SAVE_PROFILE', this.profile);

        this.saving = false;
        this.$bus.$emit('LOAD_PROFILE');
        this.$store.commit('SET_PROFILE_SIDEBAR_OPEN', false);
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
