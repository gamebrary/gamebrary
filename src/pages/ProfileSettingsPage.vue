<template lang="html">
  <b-container>
    <portal to="pageTitle">Profile</portal>

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

      <b-alert show>
        Never share sensitive information publicly
      </b-alert>

      <p class="text-muted">{{ `gamebrary.com/${profile.userName}` }}</p>

      <b-form-group
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
        label="About you"
        label-for="bio"
      >
        <b-form-input
          id="bio"
          v-model="profile.bio"
          placeholder="About me"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="Location"
        label-for="location"
      >
        <b-form-input
          id="location"
          v-model="profile.location"
          placeholder="Location"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="Website"
        label-for="website"
      >
        <b-form-input
          id="website"
          v-model="profile.website"
          placeholder="Website"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="Twitter"
        label-for="twitter"
      >
        <b-form-input
          id="twitter"
          v-model="profile.twitter"
          placeholder="Twitter"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="Friend Code"
        label-for="friendCode"
      >
        <b-form-input
          id="friendCode"
          v-model="profile.friendCode"
          placeholder="friendCode"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="Online ID"
        label-for="onlineId"
      >
        <b-form-input
          id="onlineId"
          v-model="profile.onlineId"
          placeholder="onlineId"
          class="mb-3"
        />
      </b-form-group>


      <b-form-group
        label="List name"
        label-for="name"
      >
        <b-form-input
          v-model="profile.gamerTag"
          placeholder="gamerTag"
        />

      </b-form-group>

      <footer class="mt-3">
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
      <p class="text-muted text-center">
        Looks like you don't have a profile setup.
        Choose a user name and get started!
      </p>

      <b-input-group class="mb-3">
        <b-form-input
          id="userName"
          autocomplete="off"
          v-model.trim="userName"
          size="lg"
          maxlength="32"
          placeholder="User name"
          required
          :state="available"
        />

        <template #append>
          <b-button
            variant="primary"
            type="submit"
          >
            <b-spinner small v-if="checkingAvailability" />
            <template v-else>Go</template>
          </b-button>
        </template>
      </b-input-group>

      <template v-if="available">
        <b-alert
          class="mt-3"
          show
          variant="success"
        >
          Great, your user name is available!
        </b-alert>

        <b-button @click="createProfile">
          <b-spinner small v-if="saving" />
          <template v-else>Create profile</template>
        </b-button>
      </template>

      <div v-else-if="!checkingAvailability && available === false">
        User name not available
      </div>
    </form>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      saving: false,
      available: undefined,
      checkingAvailability: false,
      loading: false,
      deleting: false,
      profile: null,
      userName: '',
    };
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => null);

      this.loading = false;
    },

    createProfile() {
      const { userName } = this;

      this.profile = {
        name: '',
        bio: '',
        location: '',
        website: '',
        twitter: '',
        userName,
      }

      this.save();
    },

    async save() {
      this.saving = true;

      await this.$store.dispatch('SAVE_PROFILE', this.profile);

      this.saving = false;
      this.$router.push({ name: 'public.profile', params: { userName : this.profile?.userName }});
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
