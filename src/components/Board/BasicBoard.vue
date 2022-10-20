<template lang="html">
  <div class="basic-board my-3">
    <basic-game-list :list="list" />
  </div>
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

<style lang="scss" rel="stylesheet/scss" scoped>
.basic-board {
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
}
</style>
