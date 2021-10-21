<template lang="html">
  <b-container fluid>
    <page-title title="Settings" />

    <b-list-group>
      <b-list-group-item :to="{ name: 'general-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        General
      </b-list-group-item>
      <b-list-group-item :to="{ name: 'steam-settings' }">
        <i class="fab fa-steam fa-fw" aria-hidden></i>
        Steam
      </b-list-group-item>
    </b-list-group>

    <router-view />

    <!-- <div class="d-inline-flex flex-column align-items-start">
      <language-selector />
      <game-detail-settings />
      <steam-settings />
      <dock-settings />

      <provider-card />

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
    </div> -->
  </b-container>
</template>

<script>
import LanguageSelector from '@/components/Settings/LanguageSelector';
import GameDetailSettings from '@/components/Settings/GameDetailSettings';
import SteamSettings from '@/components/Settings/SteamSettings';
import DockSettings from '@/components/Settings/DockSettings';
// import GameDetailViewSelector from '@/components/Settings/GameDetailViewSelector';
import ProviderCard from '@/components/ProviderCard';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import sessionMixin from '@/mixins/sessionMixin';
import { mapState } from 'vuex';

export default {
  components: {
    LanguageSelector,
    GameDetailSettings,
    SteamSettings,
    DockSettings,
    // GameDetailViewSelector,
    ProviderCard,
    DeleteAccountModal,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['user']),
  },
};
</script>
