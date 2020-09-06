<template lang="html">
  <b-navbar class="px-3 py-2 border-0 shadow-none" :fixed="fixed">
    <b-navbar-brand :to="{ name: 'home' }" class="border-0 p-0 mr-1">
      <img src="/static/gamebrary-logo.png" height="30" />

      <b-dropdown
        v-if="showBoardsDropdown"
        variant="transparent"
        toggle-class="p-0 px-1"
        :text="board.name"
      >
        <b-dropdown-item
          :to="`/board/${id}`"
          :key="id"
          variant="outline-primary"
          v-for="{ name, id } in sortedBoards"
          :active="board.id === id"
        >
          {{ name }}
        </b-dropdown-item>
      </b-dropdown>

      <b-button
        v-else-if="showBoardTitle"
        class="p-0 px-1"
        variant="transparent"
      >
        {{ board.name }}
      </b-button>
    </b-navbar-brand>

    <settings />
  </b-navbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Settings from '@/components/Settings';

export default {
  components: {
    Settings,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['sortedBoards']),

    fixed() {
      return this.$route.name === 'board'
        ? 'top'
        : '';
    },

    showBoardTitle() {
      return this.$route.name === 'board' && this.board.name;
    },

    showBoardsDropdown() {
      return this.showBoardTitle && this.sortedBoards.length > 1;
    },
  },
};
</script>
