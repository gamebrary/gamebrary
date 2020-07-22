<template lang="html">
  <div v-if="gameId && games[gameId]" :class="gameCardClass">

    <img :src="coverUrl" :alt="game.name" >

    <div class="game-info">
      <a @click="openDetails" v-text="game.name" />

      <game-rating
        v-if="showGameRatings && list.view !== 'covers'"
        :rating="game.rating"
        small
        @click.native="openDetails"
      />

      <b-button @click="addGame">
        {{ $t('list.addGame') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  components: {
    GameRating,
  },

  mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// @import "~styles/styles";

$gameCoverWidth: 80px;

.game-card {
  background: var(--game-card-background);
  position: relative;
  display: grid;
  grid-template-columns: $gameCoverWidth auto;
  border-radius: var(--border-radius);
  overflow: hidden;

  img {
    width: $gameCoverWidth;
    height: auto;
    display: flex;
    align-self: center;
    cursor: pointer;
  }

  .game-info {
    padding: .5rem 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;

    button {
      margin-top: .5rem;
      align-self: flex-start;
    }

    a {
      color: var(--game-card-text-color);
    }

    .game-rating, a {
      display: inline-flex;
      font-weight: bold;
    }
  }
}
</style>

