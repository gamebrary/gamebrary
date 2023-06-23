<!-- TODO: show title at top when vertical nav -->
<!-- TODO: flatten lists, only use games, show alert if has lists -->
<template lang="html">
  <b-container>
    <h2
      v-if="isVerticalNav"
      class="text-center mb-3"
    >
      {{ board.name }}
    </h2>

    <b-row
      v-for="list in board.lists"
      :key="list.id"
    >
      <standard-list
        :list="list"
      />
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import StandardList from '@/components/Lists/StandardList';

export default {
  components: {
    StandardList,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isVerticalNav']),

    list() {
      const [firstList] = this.board?.lists;

      return firstList || [];
    },

    hasLists() {
      return this.board?.lists?.length > 0;
    },
  },
};
</script>
