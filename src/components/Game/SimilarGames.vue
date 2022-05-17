<template lang="html">
  <div v-if="similarGames.length">
    You may also like:

    <b-card-group>
      <b-card
        v-for="game in similarGames"
        :key="game.id"
        :title="game.name"
        title-tag="small"
        body-class="p-1 px-2"
        :img-src="getCoverUrl(game.cover)"
        :img-alt="game.name"
        img-top
        @click="openGame(game)"
      />
    </b-card-group>
  </div>
</template>

<script>
// import GameCardCompact from '@/components/GameCards/GameCardCompact';
import { mapState } from 'vuex';

export default {
  components: {
    // GameCardCompact,
  },

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

    // TODO: move to util
    getCoverUrl(cover) {
      return cover && cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${cover.image_id}.jpg`
        : '/no-image.jpg';
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
