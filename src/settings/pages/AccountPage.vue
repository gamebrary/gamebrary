<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Account</portal>

      <p>Logged in as {{ user.displayName }} / {{ user.email }}</p>

      <b-alert show class="field" variant="light">
        <small>
          <strong>User ID:</strong>
          {{ user.uid }}
        </small>
      </b-alert>

      <b-button
        variant="light"
        @click="session_signOut"
      >
        Log out
      </b-button>

      <hr />

      <b-button
        variant="outline-dark"
        @click="$bvModal.show('deleteAccount');"
      >
        Delete account
      </b-button>

      <delete-account-modal />
    </b-container>
  </section>
</template>

<script>
import sessionMixin from '@/mixins/sessionMixin';
import { mapState } from 'vuex';

import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  mixins: [sessionMixin],

  components: {
    DeleteAccountModal,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
