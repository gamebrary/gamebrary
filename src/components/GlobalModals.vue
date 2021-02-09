<template lang="html">
  <div>
    <create-board-modal />
    <game-modal />
    <auth-modal />

    <template v-if="user">
      <keyboard-shortcuts-modal />
      <session-expired-modal />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import SessionExpiredModal from '@/components/SessionExpiredModal';
import GameModal from '@/components/Game/GameModal';
import CreateBoardModal from '@/components/Board/CreateBoardModal';
import AuthModal from '@/components/AuthModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    SessionExpiredModal,
    AuthModal,
    KeyboardShortcutsModal,
    CreateBoardModal,
    GameModal,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
