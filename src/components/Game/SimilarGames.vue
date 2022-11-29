<template lang="html">
  <section v-if="similarGames.length" class="my-5 bg-secondary rounded p-3">
    <h2 class="text-center mb-3">You may also like</h2>

    <div class="similar-games">
      <router-link
        v-for="game in similarGames"
        :key="game.id"
        :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
      >
        <b-img
          fluid
          rounded
          :src="$options.getGameCoverUrl(game.cover.image_id, 't_cover_small_2x')"
          :alt="game.name"
          img-top
        />
      </router-link>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  getGameCoverUrl,

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
    async loadGames() {
      await this.$store.dispatch('LOAD_GAMES', this.similarGameIds);

      this.similarGames = this.similarGameIds?.map(game => this.games?.[game]);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.similar-games {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
