<template lang="html">
  <div v-if="similarGames.length" class="similar-games mt-2">
    <h4 class="text-center text-muted">You may also like</h4>

    <div class="d-flex overflow-auto mb-5 justify-content-center">
      <b-img
        v-for="game in similarGames"
        :key="game.id"
        class="flex-shrink-0 mr-2 cursor-pointer"
        style="max-width: 100px;"
        rounded
        :src="getCoverUrl(game)"
        :alt="game.name"
        img-top
        @click="openGame(game)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      similarGames: [],
    };
  },

  computed: {
    ...mapState(['game', 'games']),

    similarGameIds() {
      return this.game?.similar_games;
    },
  },

  mounted() {
    if (this.similarGameIds) this.loadGames();
  },

  methods: {
    openGame(game) {
      this.$router.push({ name: 'game', params: { id: game.id, slug: game.slug } });
    },

    getCoverUrl(game) {
      return getGameCoverUrl(game);
    },

    async loadGames() {
      await this.$store.dispatch('LOAD_GAMES', this.similarGameIds.toString());

      this.similarGames = this.similarGameIds ?
        this.similarGameIds
          .map(game => this.games && this.games[game])
        : [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.similar-games {
  max-width: 90vw;
  margin: 0 auto;
}
</style>
