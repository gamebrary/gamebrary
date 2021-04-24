<template lang="html">
  <b-container class="text-white">
    <h1>Edit profile</h1>

    Username
    <b-form-input
      v-model="localProfile.userName"
      disabled
    />

    displayName
    <b-form-input
      v-model="localProfile.displayName"
    />

    twitter
    <b-form-input
      v-model="localProfile.twitter"
    />

    gamerTag
    <b-form-input
      v-model="localProfile.gamerTag"
    />

    location
    <b-form-input
      v-model="localProfile.location"
    />

    website
    <b-form-input
      v-model="localProfile.website"
    />

    bio
    <b-form-input
      v-model="localProfile.bio"
    />

    <pre class="bg-info">{{ localProfile }}</pre>

    <b-button
      @click="saveProfile"
      variant="primary"
    >
      <b-spinner small v-if="saving" />
      <span v-else>Save profile</span>
    </b-button>

    <!-- TODO: warn before deleting -->
    <b-button class="ml-1" variant="danger" @click="deleteProfile">
      Delete profile
    </b-button>

  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      localProfile: {},
      saving: false,
      defaultProfile: {
        displayName: 'Roman Cervantes',
        bio: 'Software Developer from México',
        location: 'Arizona, USA',
        website: 'gamebrary.com',
        twitter: 'twitter.com/romancm',
      },
    };
  },

  computed: {
    ...mapState(['profile']),
  },

  mounted() {
    this.localProfile = {
      ...JSON.parse(JSON.stringify(this.profile)),
      ...this.defaultProfile,
    };
  },

  methods: {
    async saveProfile() {
      this.saving = true;

      // TODO: toast on success
      // TODO: catch error
      await this.$store.dispatch('SAVE_PROFILE', this.localProfile);

      this.saving = false;
    },

    deleteProfile() {
      this.$store.dispatch('DELETE_PROFILE');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
