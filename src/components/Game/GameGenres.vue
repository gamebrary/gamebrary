<template lang="html">
  <div class="genres" v-if="gameGenres">
    <b-button
      v-for="genre in gameGenres"
      :key="genre.id"
      variant="transparent"
    >
      <i v-if="genre.icon" :class="`${genre.icon} p-0`" />
      <span v-else>{{ genre.id }}</span>
      <br />
      <small>{{ genre.name }}</small>
    </b-button>
    <!-- <pre class="text-dark">{{ genres }}</pre> -->
    <!-- <pre class="text-dark">{{ game.genres }}</pre> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GENRE_ICONS } from '@/constants';

export default {
  computed: {
    ...mapState(['game']),

    gameGenres() {
      const gameGenres = this.game?.genres || [];

      return gameGenres.map(genre => ({
        ...genre,
        icon: GENRE_ICONS[genre.id] || null,
      }));
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
