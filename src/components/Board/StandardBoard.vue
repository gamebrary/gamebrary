<template lang="html">
  <section class="standard-board pb-5">
    <b-container>
      <b-row
        v-for="list in board.lists"
        :key="list.id"
      >
        <standard-list
          :list="list"
        />
      </b-row>
    </b-container>
  </section>
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

<style lang="scss" rel="stylesheet/scss" scoped>
.standard-board {
  height: calc(100vh - 54px);
  overflow-y: auto;
}
</style>

