<template lang="html">
  <div v-if="similarGames.length">
    <h4 class="text-center text-muted">You may also like</h4>

    <div class="d-flex overflow-auto">
      <b-card
        v-for="game in similarGames"
        :key="game.id"
        :title="game.name"
        class="flex-shrink-0 mr-2 cursor-pointer"
        style="max-width: 180px;"
        body-class="p-2 text-center text-muted"
        :img-src="getCoverUrl(game)"
        :img-alt="game.name"
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
  props: {
    loading: Boolean,
  },

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
      this.similarGames = [];

      // TODO: use try catch
      // TODO: append cover url directly here
      await this.$store.dispatch('LOAD_GAMES', this.similarGameIds.toString());

      this.similarGames = this.similarGameIds ?
        this.similarGameIds
          .map(game => this.games && this.games[game])
        : [];
    },
  },
};
</script>
