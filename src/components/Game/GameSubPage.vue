<template lang="html">
  <div>
    <b-col>
      <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
        <b-img :src="gameCoverUrl" width="200" rounded class="mb-2 mr-2" />
      </router-link>
    </b-col>

    <b-col>
      <slot />
    </b-col>
  </div>
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

