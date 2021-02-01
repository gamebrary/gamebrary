<!-- TODO: translate -->
<template lang="html">
  <b-modal
    centered
    cancel-title="Sign out"
    cancel-variant="primary"
    ok-title="Authenticate with Google"
    ok-variant="success"
    hide-header-close
    @ok="login"
    @cancel="logout"
    no-close-on-backdrop
    v-model="sessionExpired"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Uh oh!"
        @close="close"
      />
    </template>

    Your session has expired.
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['sessionExpired']),

    publicPageUrl() {
      // TODO: move to getter and replace other instances
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://gamebrary.com';
    },

    authUrl() {
      // TODO: move to getter and replace other instances
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://app.gamebrary.com';
    },
  },

  methods: {
    login() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);
      window.location.href = this.authUrl;
    },

    logout() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);

      window.location.href = this.publicPageUrl;
    },
  },
};
</script>
