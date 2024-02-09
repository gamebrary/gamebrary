<template lang="html">
  <div class="pt-3">
    <PageTitle title="Settings" />

    <div>
      <h3>Game rating type</h3>

      <b-button
        class="mr-3"
        variant="light"
        href="https://accounts.google.com/"
        target="_blank"
      >
        Manage account
      </b-button>

      <hr />

      <b-button
        variant="danger"
        v-b-modal.deleteAccount
      >
        Delete account
      </b-button>

      <delete-account-modal />

      <b-link :to="{ name: 'dev.tools' }">
        <i class="fa fa-cog fa-fw" aria-hidden="true" />
        <span class="ml-2">Dev tools</span>
      </b-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  components: {
    DeleteAccountModal,
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'navPosition', 'ageRating']),
  },
};
</script>
