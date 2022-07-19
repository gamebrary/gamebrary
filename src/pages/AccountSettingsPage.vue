<template lang="html">
  <b-container>
    <provider-card />
    <delete-account-modal />

    <div class="mb-3">
      <b-button
        class="mr-3"
        variant="danger"
        v-b-modal:deleteAccount
      >
        Delete Account
      </b-button>

      <b-button
        @click="session_signOut"
      >
        <i class="fa-solid fa-arrow-right-from-bracket" />
        Log out
      </b-button>
    </div>
  </b-container>
</template>

<script>
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import ProviderCard from '@/components/ProviderCard';
import { mapState } from 'vuex';
import sessionMixin from '@/mixins/sessionMixin';

export default {
  components: {
    ProviderCard,
    DeleteAccountModal,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
