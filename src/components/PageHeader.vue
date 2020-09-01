<template lang="html">
  <b-navbar class="px-3 py-2 border-0 shadow-none" :fixed="fixed">
    <b-navbar-brand :to="{ name: 'home' }" class="border-0 p-0">
      <img src="/static/gamebrary-logo.png" height="30" />

      <small
        v-if="showBoardTitle"
        class="d-inline d-md-none"
        v-text="board.name"
      />
    </b-navbar-brand>

    <b-nav
      v-if="showBoardTitle"
      class="d-none d-md-flex"
      align="center"
      pills
    >
      <b-nav-item
        link-classes="p-2"
        :to="`/board/${id}`"
        :key="id"
        v-for="{ name, id } in sortedBoards"
        :active="board.id === id"
      >
        {{ name }}
      </b-nav-item>
    </b-nav>

    <legacy-settings v-if="isLegacyBoard" />
    <settings v-else />
  </b-navbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Settings from '@/components/Settings';
import LegacySettings from '@/components/LegacyBoard/LegacySettings';

export default {
  components: {
    Settings,
    LegacySettings,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['sortedBoards']),

    fixed() {
      return this.$route.name === 'board'
        ? 'top'
        : '';
    },

    isLegacyBoard() {
      return this.$route.name === 'legacy-board';
    },

    showBoardTitle() {
      return this.$route.name === 'board' && this.board.name;
    },
  },
};
</script>
