<template lang="html">
  <b-container fluid>
    <page-title title="Account settings" />

    <provider-card />

    <b-button
      @click="session_signOut"
      variant="light"
      class="mb-2 mt-2 mr-2"
    >
      {{ $t('global.signOut') }}
    </b-button>

    <b-button
      variant="danger"
      v-b-modal:account-settings
    >
      Delete Account
    </b-button>

    <delete-account-modal />
  </b-container>
</template>

<script>
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import ProviderCard from '@/components/ProviderCard';
import sessionMixin from '@/mixins/sessionMixin';
import { mapState } from 'vuex';

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

