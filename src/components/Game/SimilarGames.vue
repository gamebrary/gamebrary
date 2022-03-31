<template lang="html">
  <div v-if="similarGames.length">
    You may also like:

    <b-card
      v-for="game in similarGames"
      :key="game.id"
      no-body
      class="overflow-hidden mb-2"
    >
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img
            :src="getCoverUrl(game.cover)"
            class="rounded m-2"
            @click="openGame(game)"
          />
          <!-- <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img> -->
        </b-col>
        <b-col md="6">
          <div class="p-2">{{ game.name }}</div>
        </b-col>
      </b-row>
    </b-card>
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
    openGame(game) {
      this.$router.push({ name: 'game', params: { gameId: game.id, gameSlug: game.slug } });
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
          .filter(game => this.games && this.games[game] && this.games[game].cover)
          .map(game => this.games && this.games[game])
        : [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
