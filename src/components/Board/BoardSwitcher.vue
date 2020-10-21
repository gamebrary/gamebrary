<template lang="html">
  <b-dropdown
    v-if="hasMultipleBoards"
    dropright
    right
    no-caret
    boundary="viewport"
    v-b-tooltip.hover.right
    variant="transparent"
    :title="$t('navMenu.changeBoard')"
    :menu-class="nightMode ? 'bg-dark' : ''"
  >
    <template v-slot:button-content>
      <icon name="arrow-switch" />
    </template>

    <b-dropdown-item
      :to="`/board/${id}`"
      :key="id"
      v-for="{ name, id } in sortedBoards"
      :variant="nightMode ? 'white' : 'transparent'"
      :active="board.id === id"
    >
      {{ name }}
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item-button>
      <create-board />
    </b-dropdown-item-button>
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
