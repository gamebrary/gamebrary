<template lang="html">
  <b-modal
    id="edit-profile"
    :header-bg-variant="darkTheme ? 'dark' : null"
    :header-text-variant="darkTheme ? 'white' : null"
    :body-bg-variant="darkTheme ? 'dark' : null"
    :body-text-variant="darkTheme ? 'white' : null"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit profile"
        @close="close"
      >
        <b-button
          variant="primary"
          @click="save"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

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

  </b-modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

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
        // profilePicture: '',
        // backdrop: '',
        location: 'Chandler, AZ',
        website: 'https://gamebrary.com',
        twitter: 'romancm',
      },
    };
  },

  computed: {
    ...mapGetters(['darkTheme']),
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
