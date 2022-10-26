<template lang="html">
  <b-container class="my-3">
    <b-row>
      <basic-game-list :list="list" />
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BasicGameList from '@/components/Lists/BasicGameList';

export default {
  components: {
    BasicGameList,
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
