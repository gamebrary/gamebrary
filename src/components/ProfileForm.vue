<!-- TODO: move into separate components -->
<template lang="html">
  <b-spinner v-if="loading" class="spinner-centered" />

  <form
    v-else-if="profile"
    class="field centered"
    @submit.prevent="save"
  >
    <portal to="headerActions">
      <b-button
        :to="{ name: 'public.profile', params: { userName: profile.userName } }"
        class="mr-2"
      >
        View profile
      </b-button>
    </portal>

    <b-spinner v-if="uploading" />

    <b-avatar
      v-else
      class="mb-3"
      rounded
      :src="avatarImage"
      size="120"
      @click.native="triggerFileUpload"
    />

    <!-- TODO: add delete option -->
    <!-- TODO: replace when uploading? -->

    <b-form-group
      label-class="m-0 text-muted"
      label="User ID"
      label-for="id"
    >
      <b-form-input
        id="id"
        readonly
        v-model="user.uid"
        class="mb-3"
      />
    </b-form-group>

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
      label="Twitter"
      label-for="twitter"
    >
      <b-form-input
        id="twitter"
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

    <footer class="mt-3 mb-5">
      <b-button
        variant="primary"
        type="submit"
      >
        <b-spinner small v-if="saving" />
        <template v-else>Save</template>
      </b-button>

      <b-button
        variant="link"
        class="text-danger"
        :disabled="deleting"
        @click="confirmDeleteProfile"
      >
        <b-spinner small v-if="deleting" />
        <template v-else>Delete profile</template>
      </b-button>
    </footer>
  </form>

  <form
    v-else
    class="field centered"
    @submit.prevent="checkUserNameAvailability"
  >
    <p class="text-muted text-center">Choose a user name to get started!</p>

    <b-input-group class="mb-3">
      <b-form-input
        id="userName"
        autocomplete="off"
        v-model.trim="userName"
        size="lg"
        :minlength="$options.MIN_PROFILE_LENGTH"
        :maxlength="$options.MAX_PROFILE_LENGTH"
        required
        :state="available"
        @input="formatUserName"
      />

      <template #append>
        <b-button
          type="submit"
        >
          <b-spinner small v-if="checkingAvailability" />
          <template v-else>
            <i class="fa-solid fa-magnifying-glass" />
          </template>
        </b-button>
      </template>
    </b-input-group>

    <template v-if="available">
      <b-alert
        class="mt-3"
        show
        variant="success"
      >
        Great, <strong>{{ userName }}</strong> is available!
      </b-alert>

      <b-button block variant="success" @click="createProfile">
        <b-spinner small v-if="saving" />
        <template v-else>Create profile</template>
      </b-button>
    </template>

    <div v-else-if="!checkingAvailability && available === false">
      User name not available
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { MIN_PROFILE_LENGTH, MAX_PROFILE_LENGTH } from '@/constants';
import { getImageThumbnail } from '@/utils';

export default {
  MIN_PROFILE_LENGTH,
  MAX_PROFILE_LENGTH,

  data() {
    return {
      saving: false,
      avatarImage: null,
      available: undefined,
      checkingAvailability: false,
      loading: false,
      deleting: false,
      uploading: false,
      profile: null,
      file: null,
      userName: '',
    };
  },

  mounted() {
    this.load();
  },

  computed: {
      ...mapState(['user']),
  },

  methods: {
    autoformatWebsite() {
      const website = this.profile?.website;

      if (website && !/^https?:\/\//i.test(website)) {
        this.profile.website = `https://${website}`;
      }
    },

    async load() {
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => null);

      if (this.profile?.avatar) this.loadAvatarImage();

      this.loading = false;
    },

    async loadAvatarImage() {
      try {
        const thumbnailRef = getImageThumbnail(this.profile?.avatar);

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
      } catch (e) {
        this.profile.avatar = null;
        this.save(false);
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

        this.save(false);

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile.avatar);
      } catch (e) {
        this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
      }

      this.uploading = false;
      this.file = null;
    },

    createProfile() {
      const { userName } = this;

      this.profile = {
        name: '',
        bio: '',
        location: '',
        website: '',
        twitter: '',
        psnId: '',
        steamFriendCode: '',
        gamerTag: '',
        friendCode: '',
        userName,
        avatar: null,
      }

      this.save(false);
    },

    async save(redirect = true) {
      this.saving = true;

      await this.$store.dispatch('SAVE_PROFILE', this.profile);

      this.saving = false;

      if (redirect) {
        this.$router.push({ name: 'public.profile', params: { userName : this.profile?.userName }});
      }
    },

    formatUserName() {
      this.userName = this.userName.replace(/\W/g, '');
    },

    async checkUserNameAvailability() {
      this.checkingAvailability = true;

      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', this.userName);

      this.checkingAvailability = false;
    },

    async confirmDeleteProfile() {
      this.deleting = true;
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure?')
        .catch(() => {});

      if (confirmed) {
        this.$store.dispatch('DELETE_PROFILE');
        this.profile = null;
      }

      this.deleting = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
