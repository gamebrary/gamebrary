<template lang="html">
  <b-card
    v-if="boardsWithGame.length"
    class="mt-3"
    body-class="p-2"
  >
    <p class="mb-2 text-center">Found in:</p>

    <b-button
      v-for="board in boardsWithGame"
      :to="{ name: 'board', params: { id: board.id } }"
      :key="board.id"
      variant="light"
      block
      size="sm"
    >
      {{ board.name }}
    </b-button>
  </b-card>
</template>

<script>
export default {
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
