<template lang="html">
  <b-container>
    <h1 class="d-none d-sm-block">Settings</h1>

    <div class="d-inline-flex flex-column align-items-start">
      <languages />

      Open games in:
      <!-- Open games in:
      <b-form-select class="mb-3">
        <b-form-select-option value="modal">Modal</b-form-select-option>
        <b-form-select-option value="side">Side panel</b-form-select-option>
        <b-form-select-option value="new">New page</b-form-select-option>
      </b-form-select> -->

      <div class="border-top w-100 mt-3 mb-4" />

      <!-- <provider-card /> -->

      <b-button
        @click="session_signOut"
        variant="secondary"
        class="my-2"
      >
        {{ $t('global.signOut') }}
      </b-button>

      <b-button
        variant="danger"
        v-b-modal:account-settings
      >
        Delete Account
      </b-button>

      <delete-account />
    </div>
  </b-container>
</template>

<script>
import Languages from '@/components/Settings/Languages';
// import ProviderCard from '@/components/ProviderCard';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import sessionMixin from '@/mixins/sessionMixin';
import { mapState } from 'vuex';

export default {
  components: {
    Languages,
    // ProviderCard,
    DeleteAccountModal,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['user']),
  },
};
</script>
