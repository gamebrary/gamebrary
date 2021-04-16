<template lang="html">
  <div>
    <!-- <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
      <b-form-input id="inline-form-input-username" placeholder="Username"></b-form-input>
    </b-input-group> -->
    <b-form inline>
      <label class="sr-only" for="inline-form-input-username">Username</label>
      <b-form-group
        label-for="userName"
        valid-feedback="Available"
        invalid-feedback="User name taken"
        prepend="http://gamebrary.com/"
        :state="available"
      >
        <b-input-group prepend="http://gamebrary.com/" class="mb-2 mr-sm-2 mb-sm-0">
          <b-form-input
            id="userName"
            v-model="userName"
            placeholder="Pick a user name"
            debounce="500"
            autofocus
            @update="checkUserNameAvailability"
            :state="state"
          />
        </b-input-group>
      </b-form-group>

      <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Accept Terms</b-form-checkbox>

      <b-button
        :variant="available && userName ? 'success' : 'primary'"
        :disabled="!available || !userName"
        @click="createProfile"
      >
        Create profile
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
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
    };
  },

  computed: {
    ...mapGetters(['darkTheme']),
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
      const { userName } = this;

      await this.$store.dispatch('SAVE_PROFILE', { userName });

      this.saving = false;
      // this.$bvModal.hide('edit-profile');
    },

    async checkUserNameAvailability(userName) {
      if (!userName) return;
      this.available = null;

      // console.log(userName);
      this.loading = true;

      this.available = await this.$store.dispatch('CHECK_PROFILE_USERNAME_AVAILABILITY', userName);

      // console.log(this.available);
      this.loading = false;
      this.$emit('result', this.available);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
