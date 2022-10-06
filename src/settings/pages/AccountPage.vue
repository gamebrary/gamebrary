<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Account</portal>

      <p>Your account</p>
      <b-button
        variant="light"
        @click="session_signOut"
      >
        Log out
      </b-button>

      <p class="mt-2">Delete account</p>

      <b-button
        variant="warning"
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
