<template lang="html">
  <div>
    <PageTitle title="Games">
      <game-selector
        trigger-text="Add games"
        :variant="darkTheme ? 'success' : 'primary'"
        :filter="likedGamesIds"
        @select-game="selectGame"
      />
    </PageTitle>

    <!-- <b-button class="mr-3">
      Sort
    </b-button> -->

    <!-- <b-button class="mr-3">
      Filter
    </b-button> -->

    <empty-state
      v-if="!user"
      illustration="games"
      >
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
      </empty-state>

    <b-spinner v-else-if="loading" class="spinner-centered" />

    <div v-else-if="likedGames.length" class="small-container">
      <b-card
          v-for="game in likedGames"
          :bg-variant="darkTheme ? 'black' : 'light'"
          :text-variant="darkTheme ? 'white' : 'dark'"
          :key="game.id"
          :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
          img-alt="Image"
          img-left
          :title="game.name"
          img-width="100px"
          class="cursor-pointer mb-3"
          @click="$router.push({ name: 'game', params: { id: game.id, slug: game.slug }})"
        />
    </div>

    <empty-state
      v-else
      illustration="games"
      message="No games you've liked so far!"
      />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';
import GameSelector from '@/components/GameSelector';

export default {
  getImageUrl,
  
  components: {
    GameSelector,
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
    ...mapGetters(['darkTheme', 'isVerticalNav', 'navPosition']),

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
  },

  methods: {
    isCompleted(gameId) {
      const progress = this.progresses?.[gameId] || 0;

      return Number(progress) === 100;
    },

    toggleView() {
      this.view = this.view === 'grid'
        ? 'list'
        : 'grid';
    },

    selectGame(gameId) {
      this.$bus.$emit('SELECT_GAME', gameId);
    },

    async loadGames() {
      try {
        await this.$store.dispatch('LOAD_GAMES');

        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = Object.keys(this.games)?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (Boolean(gamesNotCached)) {
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
