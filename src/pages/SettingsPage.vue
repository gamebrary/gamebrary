<template lang="html">
  <b-container fluid>
    <page-title title="Settings" />

    <div class="d-inline-flex flex-column align-items-start">
      <language-selector />
      <game-detail-settings />
      <!-- <game-detail-view-selector /> -->

      <!-- <provider-card /> -->

      <b-button
        @click="session_signOut"
        variant="secondary"
        class="mb-2 mt-2"
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
    </div>
  </b-container>
</template>

<script>
import LanguageSelector from '@/components/Settings/LanguageSelector';
import GameDetailSettings from '@/components/Settings/GameDetailSettings';
// import GameDetailViewSelector from '@/components/Settings/GameDetailViewSelector';
// import ProviderCard from '@/components/ProviderCard';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import sessionMixin from '@/mixins/sessionMixin';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    LanguageSelector,
    GameDetailSettings,
    // GameDetailViewSelector,
    // ProviderCard,
    DeleteAccountModal,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['user']),
  },
};
</script>
