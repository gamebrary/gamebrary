<template lang="html">
  <b-container>
    <h1>Edit profile</h1>

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
        disabled
        v-model="profile.userName"
        placeholder=""
      />
    </b-form-group>

    <b-form-input
      v-model="profile.name"
      placeholder="name"
    />

    <b-form-input
      v-model="profile.bio"
      placeholder="bio"
    />

    <b-form-input
      v-model="profile.location"
      placeholder="location"
    />

    <b-form-input
      v-model="profile.website"
      placeholder="website"
    />

    <b-form-input
      v-model="profile.twitter"
      placeholder="twitter"
    />

    <pre>{{ profile }}</pre>

    <pre>{{ user }}</pre>

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
        userName: 'romancm',
        name: 'Roman Cervantes',
        bio: 'Software Developer from Mexico',
        followers: [],
        following: [],
        dateJoined: [],
        friendCode: '',
        onlineId: '',
        gamerTag: '',
        profilePicture: '',
        location: 'Chandler, AZ',
        website: 'https://gamebrary.com',
        twitter: 'romancm',
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

    checkUserNameAvailability() {
      this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', this.profile.userName)
        .then((test) => {
          this.available = test;
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
