<template lang="html">
  <b-container>
    <portal to="pageTitle">Profile</portal>

    <div class="field centered">
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

      <template v-if="available">
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
      </template>

      <pre>{{ profile }}</pre>
      <pre>{{ user }}</pre>
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
      profile: {
        userName: '',
        name: '',
        bio: '',
        followers: [],
        following: [],
        dateJoined: [],
        friendCode: '',
        onlineId: '',
        gamerTag: '',
        profilePicture: '',
        location: '',
        website: '',
        twitter: '',
      },
    };
  },

  computed: {
    ...mapState(['user']),
  },

  mounted() {
    this.$bvModal.show('edit-profile');
  },

  methods: {
    async save() {
      this.saving = true;

      await this.$store.dispatch('SAVE_PROFILE', this.profile);

      this.saving = false;
      this.$bvModal.hide('edit-profile');
    },

    async checkUserNameAvailability() {
      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', this.profile.userName);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
