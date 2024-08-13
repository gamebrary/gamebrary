<template lang="html">
  <div>
    <GameCard
      v-for="game in upcomingGames"
      :game-id="game.id"
      :key="game.id"
      @click.native="$router.push({ name: 'game', params: { id: game.game.id, slug: game.game.slug } })"
    />
  </div>
</template>

<script>
import GameCard from '@/components/GameCard';

export default {
  components: {
    GameCard,
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
      const data = await this.$store.dispatch('IGDB', {
        path: 'release_dates',

        data: `fields *, game.category, game.name, game.cover.*; where game.category = 0; sort date desc; limit: 100;`,
      });

      this.upcomingGames = data.map(({ game }) => game);

      if (this.upcomingGames?.length) this.$store.commit('CACHE_GAME_DATA', this.upcomingGames);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
