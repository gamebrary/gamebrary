<template lang="html">
  <div>
    <portal to="pageTitle">Games</portal>
    
    <portal v-if="likedGames.length" to="headerActions">
      <b-button
        title="Add games"
        v-b-tooltip.hover
        :variant="darkTheme ? 'success' : 'primary'"
        @click="addGame"
      >
        <i class="fa-solid fa-plus" />
      </b-button>
    </portal>

    <!-- <b-button class="mr-3">
      Sort
    </b-button> -->

    <!-- <b-button class="mr-3">
      Filter
    </b-button> -->

    <EmptyState
      v-if="!user"
      illustration="games"
    >
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
    </EmptyState>

    <b-spinner v-else-if="loading" class="spinner-centered" />

    <div v-else-if="likedGames.length" class="small-container pb-5">
      <GameCard
        v-for="game in likedGames"
        :key="game.id"
        :game-id="game.id"
        class="mb-3"
      />
    </div>

    <EmptyState
      v-else
      title="Welcome to your collection of top picks!"
      message="Here you'll find all the games you’ve marked as your favorites."
    >
      <b-button
        title="Add games"
        v-b-tooltip.hover
        :variant="darkTheme ? 'success' : 'primary'"
        @click="addGame"
      >
        Add games
      </b-button>
    </EmptyState>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';

export default {
  getImageUrl,
  
  components: {
    GameCard,
    EmptyState,
  },

  data() {
    return {
      loading: true,
      view: 'grid',
    }
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user', 'progresses']),
    ...mapGetters(['darkTheme', 'navPosition']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([id, liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },

    likedGamesIds() {
      return Object.entries(this.games)?.filter(([id, liked]) => liked)?.map(([id]) => Number(id));
    },
  },
  
  mounted() {
    if (this.user) this.loadGames();

    this.$bus.$on('SELECT_GAME', this.selectGame);
  },

  destroyed() {
    this.$bus.$off('SELECT_GAME', this.selectGame);
  },

  methods: {
    addGame() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: 'Add games to your favorites',
        filter: this.likedGamesIds,
      })
    },

    selectGame(gameId) {
      this.$bus.$emit('LIKE_UNLIKE_GAME', gameId);
    },

    async loadGames() {
      try {
        await this.$store.dispatch('LOAD_GAMES');

        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = Object.keys(this.games)?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (gamesNotCached) {
          await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
        }
      } catch (e) {
        console.log('error', e);
      }

      this.loading = false;
    },
  },
};
</script>
