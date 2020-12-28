<template lang="html">
  <div
    class="mini-board p-1 rounded"
    :style="miniBoardStyles"
  >
    <small>
      {{ board.name }}

      <template v-if="board.platforms.length > 1">
        ({{ board.platforms.length }} {{ $t('boards.platforms') }})
      </template>
    </small>

    <div class="lists rounded overflow-hidden">
      <div
        v-for="list in board.lists"
        :key="list.name"
        class="rounded overflow-hidden list"
      >
        <div v-if="list.games.length" :title="list.name">
          <div
            v-for="game in list.games"
            :key="game"
            class="bg-light border-bottom"
          >
            <i
              class="fas fa-ellipsis-h text-secondary ml-1"
              aria-hidden
            />
          </div>
        </div>

        <div
          v-else
          class="rounded overflow-hidden list"
        >
          <i
            class="fas fa-ellipsis-h text-secondary ml-1"
            aria-hidden
          />
        </div>
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

      // TODO: use optional chaining
      return this.board && this.board.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$boardHeight: 180px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #ccc;
  height: $boardHeight;
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
  flex-shrink: 0;
  margin-right: 5px;
}
</style>
