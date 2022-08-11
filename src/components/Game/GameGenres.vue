<template lang="html">
  <div v-if="gameGenres" class="pr-2 pb-3 small">
    <strong>Genres:</strong>

    {{ gameGenres }}

    <!-- <span
      v-for="genre in gameGenres"
      :key="genre.id"
      class="mr-1"
    >
      {{ genre.name }}
    </span> -->
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

      return gameGenres.map((genre) => genre.name).join(', ');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
