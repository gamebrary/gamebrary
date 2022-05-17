<template lang="html">
  <div>
    <auth-modal />
    <keyboard-shortcuts-modal />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AuthModal from '@/components/AuthModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default {
  components: {
    AuthModal,
    KeyboardShortcutsModal,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
