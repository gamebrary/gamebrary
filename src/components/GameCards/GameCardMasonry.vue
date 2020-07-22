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
// @import "~styles/styles";

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
      bottom: .25rem;
      right: .25rem;
      padding: .2rem .3rem;
      background: var(--list-background);
    }
  }

  .game-progress {
    width: calc(100% - 1rem);
    position: absolute;
    bottom: .3rem;
    left: .5rem;

    + .release-date {
      margin: 0;
      position: absolute;
      bottom: 1.5rem;
      right: .5rem;
      padding: .2rem .3rem;
      background: var(--list-background);
    }
  }

  .release-date {
    color: var(--accent-color);
    font-size: 10px;
    font-weight: bold;
    justify-self: end;
    margin: .25rem 0;
    border-radius: calc(var(--border-radius) / 2);
  }

  .draggable-icon {
    //@include drag-cursor;
    position: absolute;
    color: #e5e5e5;
    right: .33rem;
    top: .33rem;

    &:hover {
      color: #a5a2a2;
    }
  }
}
</style>
