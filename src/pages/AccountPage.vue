<template lang="html">
  <div class="pt-3">
    <portal to="pageTitle">
      Settings
    </portal>

    <b-button
      class="mr-3"
      variant="light"
      href="https://accounts.google.com/"
      target="_blank"
    >
      Manage account
    </b-button>

    <b-button
      variant="danger"
      v-b-modal.deleteAccount
    >
      Delete account
    </b-button>

    <!-- TODO: finish migrating firebase and restore delete account modal -->
    <!-- <delete-account-modal /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// TODO: restore and finish delete account modal
// import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {

  components: {
    // DeleteAccountModal,
  },

  computed: {
    
  },

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
