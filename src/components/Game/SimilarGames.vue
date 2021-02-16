<template lang="html">
  <div>
    Similar games

    <div class="games" v-if="loading">
      <b-skeleton-img
        v-for="game in similarGames"
        v-if="game.cover"
        height="100px"
      />
    </div>

    <div class="games" v-else-if="similarGames.length">
      <b-img
        v-for="game in similarGames"
        v-if="game.cover"
        :key="game.id"
        :src="getCoverUrl(game.cover)"
        class="rounded w-100"
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
  },

  data() {
    return {
      loading: false,
      similarGames: [],
    };
  },

  computed: {
    ...mapState(['games', 'gameModalData']),

    similarGameIds() {
      return this.game && this.game.similar_games;
    },
  },

  watch: {
    gameModalData(value) {
      if (value && this.similarGameIds) {
        this.loadGames();
      }
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
      const { list } = this.gameModalData;

      this.$store.commit('SET_GAME_MODAL_DATA', {
        gameId,
        list,
      });

      // const game = await this.$store.dispatch('LOAD_GAME', gameId)
      //   .catch(() => {
      //     this.loading = false;
      //     this.$bvToast.toast('Error loading game', { variant: 'error' });
      //   });
    },

    async loadGames() {
      this.loading = true;
      // similarGames

      await this.$store.dispatch('LOAD_GAMES', this.game.similar_games.toString())
        .catch(() => {
          this.loading = false;
        });

      this.similarGames = this.similarGameIds
        .filter(game => this.games && this.games[game])
        .map(game => this.games && this.games[game]);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.games {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: .5rem;
}
</style>
