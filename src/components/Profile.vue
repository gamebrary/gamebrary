<template lang="html">
  <b-container>
    gamebrary.com/{{profile.userName}}
    <b-button variant="danger" @click="deleteProfile">
      Delete profile
    </b-button>

    <!-- @action="createProfile" -->

    <!-- <h1>Edit profile</h1>
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
    /> -->
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['profile']),
  },
  methods: {
    deleteProfile() {
      this.$store.dispatch('DELETE_PROFILE');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
