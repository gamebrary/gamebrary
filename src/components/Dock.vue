<!-- TODO: only make transparent when x-scrolled -->
<template lang="html">
  <nav
    class="rounded position-fixed d-flex flex-column p-0 m-2 text-center"
    :class="{ 'bg-dark text-white': nightMode, 'border': !nightMode && isBoard }"
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
    <board-switcher />
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BoardSwitcher from '@/components/Board/BoardSwitcher';
import PinnedBoards from '@/components/Board/PinnedBoards';

export default {
  components: {
    BoardSwitcher,
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
