<template lang="html">
  <div
    class="mini-board overflow-hidden p-1 rounded cursor-pointer bg-secondary"
    :style="miniBoardStyles"
    @click="$emit('view-board', board.id)"
  >
    <header class="text-small d-flex align-items-center">
      <span class="mr-1">{{ board.name }}</span>

      <small v-if="board.isPublic" class="text-info">
        (Public)
      </small>

      <div class="ml-auto">
        <slot />
      </div>
    </header>

    <div class="lists rounded overflow-hidden">
      <div
        v-for="list in board.lists"
        :key="list.name"
        class="list rounded overflow-hidden mr-1 border align-self-start"
      >
        <template v-if="list.games.length">
          <div
            v-for="(game, index) in list.games"
            :key="game"
            :class="['bg-secondary', { 'border-bottom': index !== list.games.length - 1 }]"
          >
            <i class="fas fa-square fa-fw text-muted" style="margin-left: 1px;" aria-hidden />
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
      if (this.backgroundImage) {
        return `background-image: url(${this.backgroundImage});`;
      }

      // OPTIMIZE: use optional chaining
      return this.board && this.board.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// TODO: calculate this
$boardHeight: 216px;
// $boardWidth: (100% / 3) - 8px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
  width: calc(1094px / 3);
  max-width: 100%;

  @media(max-width: 768px) {
    width: 320px;
    height: 180px;
  }
}

.lists {
  max-height: $boardHeight - 40px;
  overflow-y: hidden;
  display: flex;
  flex-basis: 80px;
  flex-wrap: nowrap;
}

.list {
  width: 60px;
}
</style>
