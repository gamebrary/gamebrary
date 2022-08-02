<template lang="html">
  <b-row>
    <b-col
      offset="2"
      offset-sm="0"
      cols="8"
      sm="4"
      md="4"
      xl="3"
    >
      <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
        <b-img
          :src="gameCoverUrl"
          rounded
          class="cursor-pointer"
          fluid-grow
        />
      </router-link>
    </b-col>

    <b-col
      cols="12"
      sm="8"
      md="8"
      lg="8"
      xl="9"
      class="bg-white rounded p-5"
    >
      <slot />
    </b-col>
  </b-row>
</template>

<script>
import { getGameCoverUrl } from '@/utils';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

