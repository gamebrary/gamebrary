<template lang="html">
  <div
    class="mini-board p-1 rounded bg-secondary"
    :style="`background-image: url(${background})`"
  >
    <small>
      {{ board.name }}
      /
      {{ board.platforms.length }} {{ $t('boards.platforms') }}
    </small>

    <div class="lists rounded overflow-hidden">
      <div
        v-for="list in board.lists"
        :key="list.name"
        class="bg-light rounded list"
      >
        <div v-if="list.games.length" :title="list.name">
          <div
            v-for="game in list.games"
            :key="game"
            class="border-bottom rounded"
          >
            <i
              class="fas fa-ellipsis-h text-secondary ml-1"
              aria-hidden
            />
          </div>
        </div>

        <i
          v-else
          class="fas fa-ellipsis-h text-secondary ml-1"
          aria-hidden
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    board: Object,
    background: String,
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
