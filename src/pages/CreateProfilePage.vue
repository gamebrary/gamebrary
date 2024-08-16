<template lang="html">
  <b-form
    autocomplete="off"
    @submit.prevent="checkUserNameAvailability"
  >
    <p>Profile</p>

    <b-input-group class="mb-3">
      <b-form-input
        id="userName"
        autocomplete="off"
        v-model.trim="userName"
        :minlength="$options.MIN_PROFILE_LENGTH"
        :maxlength="$options.MAX_PROFILE_LENGTH"
        required
        :state="available"
        @input="formatUserName"
      />
      <template #prepend>
        <b-input-group-text>
          gamebrary.com/
        </b-input-group-text>
      </template>

      <template #append>
        <b-button
          type="submit"
        >
          <b-spinner small v-if="checkingAvailability" />
          <template v-else>
            <i class="fa-solid fa-magnifying-glass" />
          </template>
        </b-button>
      </template>
    </b-input-group>

    <template v-if="available">
      <b-alert
        class="mt-3"
        show
        variant="success"
      >
        Great, <strong>{{ userName }}</strong> is available!
      </b-alert>

      <b-button
        block
        variant="success"
        class="mb-3"
        @click="createProfile"
      >
        <b-spinner small v-if="saving" />
        <template v-else>Create profile</template>
      </b-button>
    </template>

    <div v-else-if="!checkingAvailability && available === false">
      User name not available
    </div>

    <hr class="my-3" />
  </b-form>
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
