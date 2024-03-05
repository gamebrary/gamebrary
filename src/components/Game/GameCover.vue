<!-- TODO: use as bg instead of img tag -->
<template>
  <div class="d-block game-cover w-100">
    <div class="flip-card" :class="{ flipped }">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="position-relative">
            <GameRatings class="position-absolute d-flex" style="bottom: 1rem; right: 1rem;" />
          
            <b-img
              :src="$options.getImageUrl(cachedGame)"
              :alt="gameName"
              class="border d-flex mb-3 w-100"
              :class="`border-${darkTheme ? 'dark' : 'light'}`"
              bordered
              rounded
              @click="flipped = !flipped"
            />
          </div>
        </div>

        <div class="flip-card-back">
          <b-button @click="flipped = !flipped">Flip!</b-button>
          <GameMedia />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameMedia from '@/components/Game/GameMedia';
import GameRatings from '@/components/Game/GameRatings';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameMedia,
    GameRatings,
  },

  data() {
    return {
      flipped: false,
    };
  },

  computed: {
    ...mapState(['game', 'cachedGames', 'games']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks', 'gameGenres']),

    cachedGame() {
      return this.cachedGames?.[Number(this.$route.params.id)] || this.game;
    },

    gameName() {
      return this.cachedGame?.name;
    },
  },
}
</script>

<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  perspective: 1000px;
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

</style>
