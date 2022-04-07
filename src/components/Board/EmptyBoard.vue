<template lang="html">
  <div class="empty-board text-center rounded p-3 mx-auto my-2 bg-secondary">
    <p class="lead">This board is empty!</p>

    <!-- TODO: use route to page -->
    <b-button
      v-b-modal.edit-board
      block
      variant="light"
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

<style lang="scss" rel="stylesheet/scss" scoped>
.empty-board {
  width: 300px;
}
</style>
