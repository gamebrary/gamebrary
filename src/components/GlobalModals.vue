<template lang="html">
  <div>
    <game-modal />
    <game-sidebar />
    <auth-modal />

    <template v-if="user">
      <keyboard-shortcuts-modal />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import GameModal from '@/components/Game/GameModal';
import GameSidebar from '@/components/Game/GameSidebar';
import AuthModal from '@/components/AuthModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    AuthModal,
    KeyboardShortcutsModal,
    GameModal,
    GameSidebar,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
