<template lang="html">
  <div>
    <auth-modal />
    <keyboard-shortcuts-modal />
    <add-remove-game />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AuthModal from '@/components/AuthModal';
import AddRemoveGame from '@/components/AddRemoveGame';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    AuthModal,
    AddRemoveGame,
    KeyboardShortcutsModal,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
