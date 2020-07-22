<template lang="html">
  <div v-if="gameId && games[gameId]" :class="gameCardClass">
    <div class="game-info">
      <a v-text="game.name" class="drag-filter" @click="openDetails"/>
      <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

      <span
        v-if="showReleaseDates && releaseDate"
        v-text="releaseDateText"
        class="release-date drag-filter"
      >
      </span>

      <game-rating
        v-if="showGameRatings && list.view !== 'covers'"
        :rating="game.rating"
        small
        class="drag-filter"
        @click.native="openDetails"
      />

      <game-progress
        v-if="gameProgress"
        small
        :progress="gameProgress"
        class="drag-filter"
        @click.native="openDetails"
      />

      <i
        v-if="note"
        :title="note"
        class="fas fa-sticky-note note drag-filter"
        @click="openDetails"
      />

      <div
        v-if="hasTags"
        class="game-tags drag-filter"
>
        <div
          v-for="({ games, hex, tagTextColor }, name) in tags"
          v-if="games.includes(game.id)"
          :key="name"
        >
          <tag
            v-if="games.includes(game.id)"
            :label="name"
            :hex="hex"
            :text-hex="tagTextColor"
            readonly
            @action="openTags"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import GameProgress from '@/components/GameDetail/GameProgress';
import GameCardUtils from '@/components/GameCards/GameCard';
import Tag from '@/components/Tag';

export default {
  components: {
    GameRating,
    GameProgress,
    Tag,
  },

  mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  $gameCoverWidth: 80px;

  .game-card {
    background: var(--game-card-background);
    margin-bottom: .5rem;
    position: relative;
    border-radius: var(--border-radius);
    min-height: 50px;
    overflow: hidden;

    &.card-placeholder {
      background: #e5e5e5;
      outline: 1px dashed #a5a2a2;
      opacity: 0.3;

      .game-card-options {
        display: none;
      }
    }

    .game-info {
      padding: .33rem .5rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .game-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: .25rem;
      }

      .tag {
        margin-right: .25rem;
      }

      i.tags {
        position: absolute;
        bottom: 1.5rem;
        right: .25rem;
      }

      .game-rating, a {
        display: inline-flex;
        font-weight: bold;
      }

      .release-date {
        color: var(--accent-color);
        margin: .25rem 0;
      }

      &:hover {
        a {
          text-decoration: underline;
        }
      }

      a {
        cursor: pointer;
        margin-right: .5rem;
        color: var(--game-card-text-color);
      }
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

    .game-tag {
      margin-bottom: .33rem;
    }
  }

  .note {
    color: var(--note-color);
  }
</style>

