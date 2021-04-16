<template lang="html">
  <div>
    <create-board-modal />
    <game-modal />
    <auth-modal />

    <template v-if="user">
      <keyboard-shortcuts-modal />
      <!-- <dev-tools-modal /> -->
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// import DevToolsModal from '@/components/DevToolsModal';
import GameModal from '@/components/Game/GameModal';
import CreateBoardModal from '@/components/Board/CreateBoardModal';
import AuthModal from '@/components/AuthModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    // DevToolsModal,
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
