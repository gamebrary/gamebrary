<template lang="html">
  <b-jumbotron class="empty-board w-100 text-center">
    <p>This board is empty</p>

    <b-button @click="openAddListModal">
      Add list
    </b-button>
  </b-jumbotron>
</template>

<script>
export default {
  methods: {
    openAddListModal() {
      // TODO: use directive instead
      this.$bvModal.show('add-list');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.empty-board {
  max-width: 300px;
}
</style>
