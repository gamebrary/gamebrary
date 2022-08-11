<template lang="html">
  <div>
    <label class="sr-only">Username</label>
    <b-form-group
      label-for="userName"
      class="field"
      valid-feedback="Available"
      :invalid-feedback="errorMessage"
      prepend="http://gamebrary.com/"
      :state="available"
    >
      <b-input-group prepend="http://gamebrary.com/" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input
          id="userName"
          v-model="userName"
          placeholder="user name"
          debounce="500"
          autofocus
          :min="$options.MIN_PROFILE_LENGTH"
          :max="$options.MAX_PROFILE_LENGTH"
          @update="checkUserNameAvailability"
          :state="state"
        />
      </b-input-group>
    </b-form-group>

    <b-button
      :variant="available ? 'success' : 'primary'"
      :disabled="!available"
      class="mt-4"
      @click="createProfile"
    >
      <b-spinner small v-if="saving || loading" />
      <span v-else>Create profile</span>
    </b-button>

    <!-- TODO: Add something about public profiles in terms and require this checkbox -->
    <!-- <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Accept Terms</b-form-checkbox> -->
  </div>
</template>

<script>
import { MIN_PROFILE_LENGTH, MAX_PROFILE_LENGTH } from '@/constants';
import { mapState } from 'vuex';

export default {
  MIN_PROFILE_LENGTH,
  MAX_PROFILE_LENGTH,

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      saving: false,
      loading: false,
      userName: this.value,
      available: null,
      errorMessage: '',
    };
  },

  computed: {
    ...mapState(['user']),

    state() {
      return this.available && this.userName.length > 6 && this.userName.length < 24;
    },
  },

  mounted() {
    this.$bvModal.show('edit-profile');
  },

  methods: {
    async createProfile() {
      this.saving = true;

      const { userName, user: { displayName, dateJoined, uid } } = this;

      const payload = {
        userName,
        displayName,
        dateJoined,
        uid,
      };

      await this.$store.dispatch('SAVE_PROFILE', payload);

      this.saving = false;
    },

    async checkUserNameAvailability(userName = '') {
      this.available = null;

      if (userName.length === 0) {
        this.available = null;
        this.errorMessage = 'Please enter a user name';

        return;
      }

      if (userName.length < MIN_PROFILE_LENGTH) {
        this.available = false;
        this.errorMessage = `User name must be at least ${MIN_PROFILE_LENGTH} characters long`;

        return;
      }

      if (userName.length > MAX_PROFILE_LENGTH) {
        this.available = false;
        this.errorMessage = `User name must be shorter than ${MAX_PROFILE_LENGTH} characters`;

        return;
      }

      const isValid = /^[0-9a-zA-Z]+$/.test(userName);

      if (!isValid) {
        this.available = false;
        this.errorMessage = 'Only letters and numbers allowed';

        return;
      }

      if (!userName) return;

      this.loading = true;

      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', userName);

      this.errorMessage = this.available ? null : 'User name not available';

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
