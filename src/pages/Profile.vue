<template lang="html">
  <b-container>
    <div v-if="loading">

    </div>

    <empty-state
      v-else-if="isEmpty"
      title="Profiles"
      message="Share boards with other users, get your own shareable URL, and more!"
    >
      <profile-name-check-field />
    </empty-state>

    <profile v-else />
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
import EmptyState from '@/components/EmptyState';
import ProfileNameCheckField from '@/components/Profile/ProfileNameCheckField';
import Profile from '@/components/Profile';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    EmptyState,
    ProfileNameCheckField,
    Profile,
  },

  data() {
    return {
      saving: false,
      loading: true,
      available: null,
    };
  },

  computed: {
    ...mapGetters(['darkTheme']),
    ...mapState(['user', 'profile']),

    isEmpty() {
      return Object.keys(this.profile).length === 0;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      await this.$store.dispatch('LOAD_PROFILE')
        .catch(() => {
          this.loading = false;
        });

      this.loading = false;
    },

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
