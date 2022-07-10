<template lang="html">
  <header class="p-2 d-flex">
    <home-button />
    <boards-dropdown v-if="board.id && isBoardPage" />
    <!-- <game-dropdown v-if="isGamePage" /> -->

    <div class="global-actions">
      <portal-target name="headerActions" />

      <!-- <b-button v-if="user" class="mr-2" variant="success" :to="{ name: 'upgrade' }">
        Upgrade
      </b-button> -->

      <b-button
        variant="primary"
        :to="{ name: 'search' }"
      >
        <i class="fas fa-search fa-fw" aria-hidden />
      </b-button>

      <b-dropdown
        v-if="user"
        boundary="viewport"
        variant="link"
        class="p-0"
        toggle-class="p-0"
        no-caret
      >
        <template #button-content>
          <b-avatar rounded variant="info" :src="user.photoURL" />
        </template>

        <b-dropdown-item
          :to="{ name: 'settings' }"
        >
          <i class="fas fa-cog fa-fw" /> Settings
        </b-dropdown-item>

        <b-dropdown-item
          :to="{ name: 'releases' }"
        >
          <i class="fas fa-rocket fa-fw" aria-hidden></i>
          Releases
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item @click="session_signOut">
          <i class="fa-solid fa-arrow-right-from-bracket" />
          Log out
        </b-dropdown-item>
      </b-dropdown>

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
import sessionMixin from '@/mixins/sessionMixin';
import { mapState } from 'vuex';

export default {
  mixins: [sessionMixin],

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
    // overflow-y: hidden;
    // height: 46px;
    grid-template-columns: 65px 1fr;
    // background-color: #574c4f;
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
