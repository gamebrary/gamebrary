<template lang="html">
  <b-container fluid>
    <page-title title="Account settings" />

    <provider-card />

    <b-button
      variant="danger"
      v-b-modal:deleteAccount
    >
      Delete Account
    </b-button>

    <delete-account-modal />
  </b-container>
</template>

<script>
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import ProviderCard from '@/components/ProviderCard';
import { mapState } from 'vuex';

export default {
  components: {
    ProviderCard,
    DeleteAccountModal,
  },


  computed: {
    ...mapState(['user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

