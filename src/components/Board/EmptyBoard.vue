<template lang="html">
  <div class="m-2 bg-secondary p-4 rounded text-center">
    <p>This board is empty</p>

    <b-button v-b-modal.add-list variant="primary">
      Add list
    </b-button>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
.empty-board {
  max-width: 300px;
}
</style>
