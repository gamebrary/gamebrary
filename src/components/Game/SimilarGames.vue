<!-- TODO: BUG: Changing games doesn't update similar games -->
<template lang="html">
  <div class="d-flex align-items-center overflow-auto" v-if="loading">
    <b-skeleton-img
      v-for="game in similarGames"
      :key="game.id"
      v-if="game.cover"
      height="100px"
    />
  </div>

  <div v-else-if="similarGames.length">
    <!-- TODO: limit to fewer games, increase game cover, add modal to view all -->
    You may also like:

    <div class="">
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
