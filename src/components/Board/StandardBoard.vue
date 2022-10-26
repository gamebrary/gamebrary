<template lang="html">
  <b-container class="my-3">
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

    list() {
      const [firstList] = this.board?.lists;

      return firstList || [];
    }
  },
};
</script>
