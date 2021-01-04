<template lang="html">
  <b-dropdown
    v-if="hasMultipleBoards"
    dropright
    right
    no-caret
    boundary="viewport"
    v-b-tooltip.hover.right
    :variant="nightMode ? 'dark' : 'transparent'"
    :title="$t('navMenu.changeBoard')"
    :menu-class="nightMode ? 'bg-dark' : ''"
  >
    <template v-slot:button-content>
      <i class="fas fa-retweet fa-fw" aria-hidden />
    </template>

    <b-dropdown-item
      :to="`/board/${id}`"
      :key="id"
      v-for="{ name, id } in sortedBoards"
      :active="board.id === id"
    >
      <span :class="`${nightMode ? 'text-light' : null }`">
        {{ name }}
      </span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <create-board />
  </b-dropdown>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    CreateBoard,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['sortedBoards', 'nightMode']),

    hasMultipleBoards() {
      return this.$route.name === 'board' && this.board.name && this.sortedBoards.length > 1;
    },
  },
};
</script>
