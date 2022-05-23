<template lang="html">
  <b-list-group-item v-if="gameGenres" class="p-2 small">
    <strong>Genres:</strong>
    <b-avatar
      v-for="genre in gameGenres"
      :key="genre.id"
      rounded
      button
      variant="transparent"
      class="mr-1"
      v-b-tooltip.hover
      :title="genre.name"
    >
      <i v-if="genre.icon" :class="`${genre.icon} p-0`" />
    </b-avatar>
  </b-list-group-item>
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
