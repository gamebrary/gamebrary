<template lang="html">
  <div class="px-3">
    <portal v-if="likedGames.length" to="headerActions">
      <b-dropdown
        text="Games"
        :variant="darkTheme ? 'success' : 'black'"
      >
        <b-dropdown-item-button
          title="Add games"
          v-bind="buttonProps"
          @click="addGame"
        >
          <i class="fa-solid fa-plus" />
          Add games
        </b-dropdown-item-button>
      </b-dropdown>
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
      <!-- TODO: sort by name, progress, tags -->
      <!-- TODO: filter by tags, platform -->
      <GameCard
        v-for="game in likedGames"
        :key="game.id"
        :game-id="game.id"
        :ref="`id-${game.id}`"
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
import EmptyState from '@/components/EmptyState';
import GameCard from '@/components/GameCard';
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';
export default {
  components: {
    GameCard,
    EmptyState,
  },

  data() {
    return {
      loading: false,
      view: 'grid',
    }
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user', 'progresses', 'highlightedGame']),
    ...mapGetters(['darkTheme', 'navPosition', 'buttonProps']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },

    likedGamesIds() {
      return Object.entries(this.games)?.filter(([liked]) => liked)?.map(([id]) => Number(id));
    },
  },

  watch: {
    games() {
      if (this.highlightedGame) this.highlightGame(this.highlightedGame);
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

    async highlightGame(gameId) {
      await this.$nextTick();

      const gameRef = this.$refs[`id-${gameId}`]?.[0];

      console.log('gameRef', gameRef)

      if (gameRef) {
        gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          this.$store.commit('SET_HIGHLIGHTED_GAME', null);
        }, HIGHLIGHTED_GAME_TIMEOUT);
      }
    },

    async loadGames() {
      try {
        this.loading = Object.keys(this.games)?.length === 0;
        await this.$store.dispatch('LOAD_GAMES');

        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = Object.keys(this.games)?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (gamesNotCached) {
          await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
        }
      } catch (e) {
        //
      }

      this.loading = false;
    },
  },
};
</script>
