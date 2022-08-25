<template lang="html">
  <div
    :class="['mini-board overflow-hidden rounded cursor-pointer m-0', { 'bg-light': !board.backgroundColor }]"
    :style="miniBoardStyles"
    @click="$emit('view-board', board.id)"
  >
    <header class="text-small py-1 px-2 d-flex align-items-center justify-content-between">
      <span class="mr-1 text-muted mb-1">{{ board.name }}</span>

      <b-button v-if="board.isPublic" class="bg-warning text-white p-0 px-1" size="sm">
        Public
      </b-button>
    </header>

    <div class="lists rounded overflow-hidden">
      <div
        v-for="list in board.lists"
        :key="list.name"
        class="list rounded overflow-hidden ml-2 border align-self-start"
      >
        <template v-if="list.games.length">
          <div
            v-for="(game, index) in list.games"
            :key="game"
            :class="['list bg-light', { 'border-bottom': index !== list.games.length - 1 }]"
          >
            <i class="fas fa-square fa-fw text-white" style="margin-left: 1px;" aria-hidden />
          </div>
        </template>

        <div
          v-else
          class="rounded overflow-hidden list bg-secondary"
          style="height: 22px;"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    board: Object,
    backgroundImage: String,
  },

  computed: {
    miniBoardStyles() {
      if (this.backgroundImage) return `background-image: url(${this.backgroundImage});`

      return this.board?.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$boardHeight: 200px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
}

.lists {
  max-height: $boardHeight - 40px;
  display: flex;
  flex-wrap: wrap;
}

.list {
  width: 60px;
  max-height: 160px;
}
</style>
