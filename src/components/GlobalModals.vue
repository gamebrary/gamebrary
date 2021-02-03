<template lang="html">
  <div>
    <session-expired-modal v-if="user" />
    <create-board-modal />
    <game-modal />
    <auth-modal />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import SessionExpiredModal from '@/components/SessionExpiredModal';
import GameModal from '@/components/Game/GameModal';
import CreateBoardModal from '@/components/Board/CreateBoardModal';
import AuthModal from '@/components/AuthModal';

export default {
  components: {
    SessionExpiredModal,
    AuthModal,
    CreateBoardModal,
    GameModal,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
