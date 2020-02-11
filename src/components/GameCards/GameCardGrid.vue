<template lang="html">
  <div v-if="gameId && games[gameId]" :class="gameCardClass">
    <img
      :src="coverUrl"
      :alt="game.name"
      @click="openDetails"
    >

    <game-progress
      v-if="!showGameInfo && showGameInfoOnCover && gameProgress"
      small
      :progress="gameProgress"
      @click.native="openDetails"
    />

    <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

    <div
      v-if="showGameInfo"
      class="game-info"
    >
        <a
          v-text="game.name"
          class="drag-filter"
          @click="openDetails"
        />

        <game-rating
          v-if="showGameRatings"
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

        <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

        <div v-if="hasTags" class="game-tags drag-filter">
          <tag
            v-for="({ games, hex, tagTextColor }, name) in tags"
            v-if="games.includes(game.id)"
            :key="name"
            :label="name"
            :hex="hex"
            :text-hex="tagTextColor"
            readonly
            @action="openTags"
          />
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

.game-card {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;

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
    width: 100%;
    height: 185px;
    object-fit: cover;
    display: flex;
    align-self: center;
    cursor: pointer;

    + .game-progress {
      width: calc(100% - #{$gp});
      position: absolute;
      bottom: $gp / 6;
      left: $gp / 2;
    }
  }

  progress {
    max-width: 100%;
  }

  .game-info {
    padding: $gp / 2;
    width: 100%;
    display: flex;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    flex-direction: column;
    background: var(--game-card-background);
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
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      margin-right: $gp / 2;
      color: var(--game-card-text-color);
    }

    .title-progress {
      display: grid;
      grid-template: auto auto / auto auto;

      a {
        grid-column: 1;
      }

      .game-rating {
        grid-column: 1;
        grid-row: 2;
      }

      .game-progress {
        justify-self: end;
        grid-column: 2;
        grid-row: span 2;
      }
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
