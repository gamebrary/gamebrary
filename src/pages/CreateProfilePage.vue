<template lang="html">
  <form
    autocomplete="off"
    @submit.prevent="checkUserNameAvailability"
  >
    <p>Profile</p>

    <div class="input-group mb-3">
      <span class="input-group-text">
        gamebrary.com/
      </span>
      <input
        id="userName"
        autocomplete="off"
        v-model.trim="userName"
        type="text"
        class="form-control"
        :minlength="$options.MIN_PROFILE_LENGTH"
        :maxlength="$options.MAX_PROFILE_LENGTH"
        required
        :class="{ 'is-invalid': available === false, 'is-valid': available === true }"
        @input="formatUserName"
      />
      <button
        type="submit"
        class="btn btn-outline-secondary"
      >
        <span v-if="checkingAvailability" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <i v-else class="fa-solid fa-magnifying-glass" />
      </button>
    </div>

    <template v-if="available">
      <div
        class="alert alert-success mt-3"
        role="alert"
      >
        Great, <strong>{{ userName }}</strong> is available!
      </div>

      <button
        type="button"
        class="btn btn-success w-100 mb-3"
        @click="createProfile"
        :disabled="saving"
      >
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>Create profile</span>
      </button>
    </template>

    <div v-else-if="!checkingAvailability && available === false">
      User name not available
    </div>

    <hr class="my-3" />
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { MIN_PROFILE_LENGTH, MAX_PROFILE_LENGTH, DEFAULT_PROFILE } from '@/constants';

export default {
  MIN_PROFILE_LENGTH,
  MAX_PROFILE_LENGTH,

  data() {
    return {
      userName: '',
      checkingAvailability: false,
      available: undefined,
      saving: false,
    };
  },

  computed: {
    ...mapState(['profile']),
  },

  async mounted() {
    // if (this.profile?.userName) this.$router.replace({ name: 'public.profile', params: { userName: this.profile?.userName } });
  },

  methods: {
    async createProfile() {
      this.saving = true;

      const { userName } = this;

      const payload = {
        ...DEFAULT_PROFILE,
        userName,
      }

      await this.$store.dispatch('SAVE_PROFILE', payload);

      this.saving = false;

      this.$router.push({ name: 'public.profile', params: { userName : this.profile?.userName }});
    },

    async checkUserNameAvailability() {
      this.checkingAvailability = true;

      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', this.userName);

      this.checkingAvailability = false;
    },

    formatUserName() {
      this.userName = this.userName.replace(/\W/g, '');

      if (this.available) this.available = false;
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
