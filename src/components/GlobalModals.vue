<template lang="html">
  <div>
    <create-board-modal />
    <game-modal />
    <game-sidebar />
    <auth-modal />

    <template v-if="user">
      <keyboard-shortcuts-modal />
      <dev-tools-modal />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import DevToolsModal from '@/components/DevToolsModal';
import GameModal from '@/components/Game/GameModal';
import GameSidebar from '@/components/Game/GameSidebar';
import CreateBoardModal from '@/components/Board/CreateBoardModal';
import AuthModal from '@/components/AuthModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    DevToolsModal,
    AuthModal,
    KeyboardShortcutsModal,
    CreateBoardModal,
    GameModal,
    GameSidebar,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
