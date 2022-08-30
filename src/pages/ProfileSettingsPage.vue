<template lang="html">
  <b-container>
    <portal to="pageTitle">Profile</portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <div v-else-if="profile" class="field centered">
      <b-button
        variant="link"
        class="text-danger"
        :disabled="deleting"
        @click="confirmDeleteProfile"
      >
        <b-spinner small v-if="deleting" />
        <template v-else>Delete profile</template>
      </b-button>

      <!-- TODO: use regex to validate user name, trim, etc... -->
      <!-- TODO: use debounce to search availability -->
      <!-- TODO: show additional fields when user name is accepted -->

      <!-- <template v-if="available">
        <b-form-input
          v-model="profile.name"
          placeholder="Name"
        />

        <b-form-input
          v-model="profile.bio"
          placeholder="About me"
        />

        <b-form-input
          v-model="profile.location"
          placeholder="Location"
        />

        <b-form-input
          v-model="profile.website"
          placeholder="Website"
        />

        <b-form-input
          v-model="profile.twitter"
          placeholder="Twitter"
        />

        <b-form-input
          v-model="profile.twitter"
          placeholder="friendCode"
        />

        <b-form-input
          v-model="profile.twitter"
          placeholder="onlineId"
        />

        <b-form-input
          v-model="profile.twitter"
          placeholder="gamerTag"
        />
      </template> -->
    </div>

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
        <!-- <template #prepend>
          <b-input-group-text>
            <small>gamebrary.com/</small>
          </b-input-group-text>
        </template> -->

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
            Go
          </b-button>
        </template>
      </b-input-group>


      <!-- This is a form text block (formerly known as help block) -->

      <b-spinner v-if="checkingAvailability" class="ml-3 spinner-centered" />

      <div v-else-if="available === false">
        User name not available
      </div>

      <template v-else-if="available">
        <b-alert
          class="mt-3"
          show
          variant="success"
        >
          Great, your user name is available!
        </b-alert>

        <b-button>
          Create profile
        </b-button>
      </template>
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

    async save() {
      this.saving = true;

      await this.$store.dispatch('SAVE_PROFILE', this.profile);

      this.saving = false;
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
