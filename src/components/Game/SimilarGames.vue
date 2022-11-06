<template lang="html">
  <section v-if="similarGames.length" class="mt-5">
    <!-- TODO: make white if bg is on -->
    <h4 class="text-center">You may also like</h4>

    <div class="similar-games">
      <router-link
        v-for="game in similarGames"
        :key="game.id"
        :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
      >
        <b-img
          fluid
          rounded
          :src="$options.getThumbnailUrl(game)"
          :alt="game.name"
          img-top
        />
      </router-link>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getThumbnailUrl } from '@/utils';

export default {
  getThumbnailUrl,

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
    },

    async loadGames() {
      await this.$store.dispatch('LOAD_GAMES', this.similarGameIds.toString());

      this.similarGames = this.similarGameIds?.map(game => this.games?.[game]);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.similar-games {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 1rem;
  margin-bottom: 20vh;

  @media(max-width: 780px) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
