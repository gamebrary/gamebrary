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

    <game-progress
      v-if="showGameInfoOnCover && gameProgress"
      small
      :progress="gameProgress"
      :view="list.view"
      @click.native="openDetails"
    />

    <span
      v-if="showReleaseDates && showGameInfoOnCover && releaseDate"
      v-text="releaseDate"
      class="release-date drag-filter"
    >
    </span>

    <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />
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

    + .release-date {
      margin: 0;
      position: absolute;
      bottom: $gp / 4;
      right: $gp / 4;
      padding: $gp / 8 $gp / 6;
      background: var(--list-background);
    }
  }

  .game-progress {
    width: calc(100% - #{$gp});
    position: absolute;
    bottom: $gp / 6;
    left: $gp / 2;

    + .release-date {
      margin: 0;
      position: absolute;
      bottom: $gp * 1.5;
      right: $gp / 2;
      padding: $gp / 8 $gp / 6;
      background: var(--list-background);
    }
  }

  .release-date {
    color: var(--accent-color);
    font-size: $font-size-xsmall;
    font-weight: bold;
    justify-self: end;
    margin: $gp / 4 0;
    border-radius: calc(var(--border-radius) / 2);
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
