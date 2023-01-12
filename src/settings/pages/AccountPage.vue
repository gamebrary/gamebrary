<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <h3>Account</h3>
    </portal>

    <profile-form />

    <div class="field centered">
      <b-button
        :variant="darkTheme ? 'secondary' : 'light'"
        class="mr-2"
        @click="session_signOut"
      >
        Log out
      </b-button>

      <b-button
        variant="outline-danger"
        v-b-modal.deleteAccount
      >
        Delete account
      </b-button>

      <delete-account-modal />
    </div>
  </b-container>
</template>

<script>
import sessionMixin from '@/mixins/sessionMixin';
import ProfileForm from '@/components/ProfileForm'
import { mapState, mapGetters } from 'vuex';

import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  mixins: [sessionMixin],

  components: {
    DeleteAccountModal,
    ProfileForm,
  },

  computed: {
    ...mapGetters(['darkTheme']),
  },
};
</script>
