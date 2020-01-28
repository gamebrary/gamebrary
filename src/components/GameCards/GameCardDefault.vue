<!-- TODO: abstract styles, only add card specific styles in each component -->
<template lang="html">
  <div v-if="gameId && games[gameId]" :class="gameCardClass">
    <img
      :src="coverUrl"
      :alt="game.name"
      @click="openDetails"
    >

    <div class="game-info">
      <a
        v-if="list.view !== 'covers'"
        v-text="game.name"
        class="drag-filter"
        @click="openDetails"
      />

      <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

      <game-progress
        v-if="gameProgress"
        small
        :progress="gameProgress"
        class="drag-filter"
        @click.native="openDetails"
      />

      <game-rating
        v-if="showGameRatings"
        :rating="game.rating"
        small
        class="drag-filter"
        @click.native="openDetails"
      />

      <i
        v-if="note"
        :title="note"
        class="fas fa-sticky-note note drag-filter"
        @click="openDetails"
      />

      <div v-if="hasTags" class="game-tags drag-filter">
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
  @import "~styles/styles";

  $gameCoverWidth: 80px;

  .game-card {
    background: var(--game-card-background);
    margin-bottom: $gp / 2;
    position: relative;
    display: grid;
    grid-template-columns: $gameCoverWidth auto;
    border-radius: var(--border-radius);
    overflow: hidden;

    &.card-placeholder {
      background: #e5e5e5;
      outline: 1px dashed #a5a2a2;
      opacity: 0.3;

      img {
        filter: grayscale(1);
      }

      .game-card-options {
        display: none;
      }
    }

    img {
      width: $gameCoverWidth;
      height: auto;
      display: flex;
      align-self: center;
      cursor: pointer;
    }

    .game-info {
      padding: $gp / 2 $gp;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .game-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: $gp / 4;
      }

      .tag {
        margin-right: $gp / 4;
      }

      i.tags {
        position: absolute;
        bottom: $gp * 1.5;
        right: $gp / 4;
      }

      .game-progress,
      .game-rating, a {
        display: inline-flex;
        font-weight: bold;
      }

      &:hover {
        a {
          text-decoration: underline;
        }
      }

      a {
        cursor: pointer;
        margin-right: $gp / 2;
        color: var(--game-card-text-color);
      }
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

    .game-tag {
      margin-bottom: $gp / 3;
    }
  }

  .note {
    color: var(--note-color);
  }
</style>

