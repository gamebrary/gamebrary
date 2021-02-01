<!-- TODO: only make transparent when x-scrolled -->
<template lang="html">
  <nav
    class="rounded position-fixed d-flex flex-column p-0 m-2 text-center"
    :class="{ 'bg-dark text-white': nightMode, 'border': !nightMode }"
  >
    <router-link
      :to="{ name: 'dashboard' }"
      title="Dashboard"
      class="my-2"
    >
      <img
        :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
        width="32"
      />
    </router-link>

    <pinned-boards v-if="$route.name === 'board'" />

    <b-dropdown
      id="dropdown-1"
      text="Dropdown Button"
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

      <b-dropdown-item :to="{ name: 'boards' }">
        <i class="fas fa-columns fa-fw" aria-hidden />
        Boards
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'tags' }">
        <i class="fas fa-tags fa-fw" aria-hidden />
        Tags
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'notes' }">
        <i class="fas fa-sticky-note fa-fw" aria-hidden />
        Notes
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'wallpapers' }">
        <i class="fas fa-images fa-fw" aria-hidden />
        Wallpapers
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'account' }">
        <i class="fas fa-user fa-fw" aria-hidden />
        Account
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'settings' }">
        <i class="fas fa-cog fa-fw" aria-hidden />
        Settings
      </b-dropdown-item>

      <b-dd-divider />

      <b-dropdown-item v-b-modal:create-board>
        <i class="fas fa-cog fa-fw" aria-hidden />
        Create board
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
    ...mapState(['board', 'notification', 'settings']),
    ...mapGetters(['nightMode']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 50px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);

  &:hover {
    background: white;
  }
}
</style>
