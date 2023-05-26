<!-- TODO: calendar view? -->
<template lang="html">
  <div>
    <masonry
      gutter="8px"
      :cols="{ default: 7, 1200: 5, 768: 3, 480: 2 }"
    >
      <game-card-search
        v-for="game in upcomingGames"
        :game="game.game"
        :key="game.id"
        @click.native="$router.push({ name: 'game', params: { id: game.game.id, slug: game.game.slug } })"
      />
    </masonry>
  </div>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';

export default {
  components: {
    GameCardSearch,
  },

  mounted() {
    this.load();
  },

  data() {
    return {
      upcomingGames: [],
    }
  },

  methods: {
    async load() {
      this.upcomingGames = await this.$store.dispatch('IGDB', {
        path: 'release_dates',

        data: `fields *, game.category, game.name, game.cover.*; where game.category = 0; sort date desc; limit: 100;`,
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
