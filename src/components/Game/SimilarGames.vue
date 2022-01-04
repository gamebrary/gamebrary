<template lang="html">
  <div class="games" v-if="similarGames.length">
    <!-- <pre>{{ similarGameIds }}</pre> -->
    <!-- TODO: limit to fewer games, increase game cover, add modal to view all -->
    <!-- You may also like: -->

    <!-- TODO: use array map instead -->
    <b-img
      v-for="game in similarGames"
      v-if="game.cover"
      :key="game.id"
      :src="getCoverUrl(game.cover)"
      class="rounded mr-2 mb-2 cursor-pointer"
      @click="openGame(game)"
    />
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
    ...mapState(['games', 'activeGame', 'settings']),

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
    openGame(game) {
      // TODO: use optional chaining
      const gameDetailView = this.settings && this.settings.gameDetailView;

      // TODO: store value in constant
      if (gameDetailView === 'new') {
        this.$router.push({ name: 'game', params: { gameId: game.id, gameSlug: game.slug } });
      } else {
        this.loadGame(game.id);
      }
    },

    // TODO: move to util
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

      // TODO: use try catch
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
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  width: 90vw;
}
</style>
