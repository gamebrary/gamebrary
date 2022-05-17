<template lang="html">
  <div class="empty-board text-center rounded p-3 mx-auto my-2 bg-secondary">
    <p class="lead">This board is empty!</p>

    <b-button
      block
      variant="light"
      :to="{ name: 'board.edit', params: { id: board.id } }"
    >
      Edit board
    </b-button>

    <b-button
      v-b-modal.add-list
      block
      variant="primary"
    >
      Add list
    </b-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.empty-board {
  width: 300px;
}
</style>
