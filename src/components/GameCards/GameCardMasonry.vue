<template lang="html">
  <div
    v-if="gameId && games[gameId]"
    :class="gameCardClass"
  >
    <img
      :src="coverUrl"
      :alt="game.name"
      @click="openDetails"
    >

    <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

    <game-progress
      v-if="gameProgress"
      small
      :progress="gameProgress"
      :view="list.view"
      @click.native="openDetails"
    />
  </div>
</template>

<script>
import GameProgress from '@/components/GameDetail/GameProgress';
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  components: {
    GameProgress,
  },

  mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.game-card {
  display: flex;
  flex-direction: column;
  position: relative;
  width: calc((100%/3) - 5.5px);
  margin-bottom: 4px;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
  }

  .game-progress {
    width: calc(100% - #{$gp});
    position: absolute;
    bottom: $gp / 6;
    left: $gp / 2;
  }

  .draggable-icon {
    @include drag-cursor;
    position: absolute;
    color: #e5e5e5;
    right: $gp / 3;
    top: $gp / 3;

    &:hover {
      color: #a5a2a2;
    }
  }
}
</style>
