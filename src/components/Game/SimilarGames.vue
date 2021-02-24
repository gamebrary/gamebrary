<template lang="html">
  <div class="games" v-if="loading">
    <b-skeleton-img
      v-for="game in similarGames"
      :key="game.id"
      v-if="game.cover"
      height="100px"
    />
  </div>

  <div v-else-if="similarGames.length">
    You may also like:

    <div class="games no-scrollbar">
      <b-img
        v-for="game in similarGames"
        v-if="game.cover"
        :key="game.id"
        :src="getCoverUrl(game.cover)"
        class="rounded mr-2 cursor-pointer"
        height="80"
        @click="loadGame(game.id)"
      />
    </div>
  </div>
</template>

<script>
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardCompact,
  },

  props: {
    game: Object,
    loading: Boolean,
  },

  data() {
    return {
      similarGames: [],
    };
  },

  computed: {
    ...mapState(['games', 'activeGame']),

    similarGameIds() {
      return this.game && this.game.similar_games;
    },
  },

  mounted() {
    if (this.similarGameIds) {
      this.loadGames();
    }
  },

  methods: {
    getCoverUrl(cover) {
      return cover && cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },

    loadGame(gameId) {
      const { list } = this.activeGame;

      this.$store.commit('SET_GAME_MODAL_DATA', { gameId, list });
    },

    async loadGames() {
      this.similarGames = [];

      await this.$store.dispatch('LOAD_GAMES', this.similarGameIds.toString());

      this.similarGames = this.similarGameIds ?
        this.similarGameIds
          .filter(game => this.games && this.games[game])
          .map(game => this.games && this.games[game])
        : [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.games {
  display: flex;
  align-items: center;
  overflow-x: auto;
}
</style>
