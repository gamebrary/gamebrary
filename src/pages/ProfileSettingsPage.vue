<template lang="html">
  <b-container>
    <portal to="pageTitle">Profile</portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <div v-else class="field centered">
      <pre>{{ profile }}</pre>

      <div v-if="profile.username">
        <b-button class="ml-1" variant="danger" @click="deleteProfile">
          Delete profile
        </b-button>

        <b-button @click="checkUserNameAvailability">
          Check availability
        </b-button>

        <b-form-group
          label="Pick a user name"
          label-for="userName"
          valid-feedback="Available"
          invalid-feedback="User name taken"
          :state="available"
        >
          <b-form-input
            id="userName"
            v-model="profile.userName"
            placeholder="User name"
          />
        </b-form-group>
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
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      saving: false,
      available: null,
      loading: false,
      profile: null,
    };
  },

  computed: {
    ...mapState(['profile']),
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PROFILE')

      this.loading = false;
    },

    async save() {
      this.saving = true;

      await this.$store.dispatch('SAVE_PROFILE', this.profile);

      this.saving = false;
    },

    async checkUserNameAvailability() {
      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', this.profile.userName);
    },

    deleteProfile() {
      this.$store.dispatch('DELETE_PROFILE');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
