<template lang="html">
  <nav
    class="bg-white rounded position-fixed d-flex flex-column p-0 m-2 text-center border"
    :class="{ 'bg-dark text-white border-dark': nightMode }"
  >
    <b-button
      title="Dashboard"
      variant="transparent"
      class="my-2 p-0"
      @click="handleLogoClick"
    >
      <img
        :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
        width="32"
      />
    </b-button>

    <pinned-boards v-if="user" />

    <b-dropdown
      v-if="user"
      dropright
      right
      no-caret
      boundary="viewport"
      :variant="nightMode ? 'dark' : 'transparent'"
      :menu-class="nightMode ? 'bg-dark' : ''"
    >
      <template v-slot:button-content>
        <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
      </template>

      <template v-if="$route.name === 'board'">
        <b-dropdown-header id="dropdown-header-label">
          {{ board.name }}
        </b-dropdown-header>

        <b-dropdown-item
          v-b-modal:edit-board
          :variant="nightMode ? 'secondary' : null"
        >
          <i class="fas fa-edit fa-fw" aria-hidden />
          Edit board
        </b-dropdown-item>

        <b-dropdown-item
          v-b-modal:add-list
          :variant="nightMode ? 'secondary' : null"
        >
          <i class="fas fa-folder-plus fa-fw" />
          Add list
        </b-dropdown-item>

        <b-dropdown-item
          @click="pinBoard"
          :variant="nightMode ? 'secondary' : null"
        >
          <i class="fas fa-thumbtack fa-fw" />
          {{ board.pinned ? 'Unpin from dock' : 'Pin to dock' }}
        </b-dropdown-item>

        <b-dd-divider />
      </template>

      <b-dropdown-item
        v-b-modal:create-board
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-plus fa-fw" aria-hidden />
        Create board
      </b-dropdown-item>

      <b-dd-divider />

      <b-dropdown-item
        :to="{ name: 'boards' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-columns fa-fw" aria-hidden />
        Boards
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'tags' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-tags fa-fw" aria-hidden />
        Tags
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'notes' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-sticky-note fa-fw" aria-hidden />
        Notes
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'wallpapers' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-images fa-fw" aria-hidden />
        Wallpapers
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'account' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-user fa-fw" aria-hidden />
        Account
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'settings' }"
        :variant="nightMode ? 'secondary' : null"
      >
        <i class="fas fa-cog fa-fw" aria-hidden />
        Settings
      </b-dropdown-item>
    </b-dropdown>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';

export default {
  components: {
    PinnedBoards,
  },

  computed: {
    ...mapState(['board', 'notification', 'settings', 'user']),
    ...mapGetters(['nightMode']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },
  },

  methods: {
    handleLogoClick() {
      if (!this.user) {
        if (this.$route.name === 'public-boards') {
          this.$bvModal.show('authModal');
        } else {
          this.$router.push({ name: 'public-boards' });
        }
      }

      if (this.user && this.$route.name !== 'boards') {
        this.$router.push({ name: 'boards' });
      }
    },

    async pinBoard() {
      const payload = {
        ...this.board,
        pinned: !this.board.pinned,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);
      this.$store.commit('UPDATE_BOARDS', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.$bvToast.toast('Board settings saved');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 50px;
  z-index: 1;
}
</style>
