<template lang="html">
  <header class="p-2 d-flex">
    <home-button />
    <portal-target name="headerTitle" slim />
    <boards-dropdown v-if="board.id && isBoardPage" />
    <!-- <game-dropdown v-if="isGamePage" /> -->

    <div class="global-actions">
      <portal-target name="headerActions" />

      <!-- <b-button v-if="user" class="mr-2" variant="success" :to="{ name: 'upgrade' }">
        Upgrade
      </b-button> -->

      <b-button
        variant="light"
        class="mr-3"
        :to="{ name: 'search' }"
      >
        <i class="fas fa-search fa-fw" aria-hidden />
      </b-button>

      <router-link
        v-if="user"
        variant="primary"
        class="mr-1"
        :to="{ name: 'settings' }"
      >
        <b-avatar size="38" rounded variant="info" :src="user.photoURL" />
      </router-link>

      <b-button
        v-else
        class="ml-2"
        variant="primary"
        :to="{ name: 'auth' }"
      >
        Login
      </b-button>
    </div>
  </header>
</template>

<script>
// import GameDropdown from '@/components/Game/GameDropdown';
import BoardsDropdown from '@/components/BoardsDropdown';
import HomeButton from '@/components/Shared/HomeButton';
import { mapState } from 'vuex';

export default {

  components: {
    // GameDropdown,
    BoardsDropdown,
    HomeButton,
  },

  computed: {
    ...mapState(['board', 'boards', 'user', 'game']),

    isBoardPage() {
      return this.$route.name.startsWith('board');
    },

    isGamePage() {
      return this.$route.name.startsWith('game');
    },

    showBoardName() {
      return this.$route.name === 'board' && this.board?.name;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 65px 1fr;
    z-index: 1;
  }

  .toolbar {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .global-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
</style>
