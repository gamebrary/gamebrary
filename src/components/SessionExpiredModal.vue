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
import sessionMixin from '@/mixins/sessionMixin';

export default {
  mixins: [sessionMixin],

  computed: {
    ...mapState(['sessionExpired']),
  },

  methods: {
    login() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);
      window.location.href = this.session_authUrl;
    },

    logout() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);

      window.location.href = this.session_publicSiteUrl;
    },
  },
};
</script>
