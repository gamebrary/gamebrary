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

      <b-dropdown
        text="Sort"
        :variant="darkTheme ? 'success' : 'black'"
        class="ml-2"
      >
        <b-dropdown-item-button
          v-for="option in sortOptions"
          :key="option.value"
          :active="sortBy === option.value"
          @click="changeSort(option.value)"
        >
          <i :class="option.icon" class="mr-2" />
          {{ option.label }}
          <i
            v-if="sortBy === option.value"
            :class="sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'"
            class="ml-2"
          />
        </b-dropdown-item-button>
      </b-dropdown>
    </portal>

    <EmptyState
      v-if="!user"
      illustration="games"
    >
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
    </EmptyState>

    <b-spinner v-else-if="loading" class="spinner-centered" />

    <div v-else-if="likedGames.length" class="small-container pb-5">
      <GameCard
        v-for="game in sortedGames"
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
      loading: true,
      view: 'grid',
      sortBy: 'name',
      sortOrder: 'asc',
    }
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user', 'progresses', 'highlightedGame', 'gamesSortOrder']),
    ...mapGetters(['darkTheme', 'navPosition', 'buttonProps']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },

    sortedGames() {
      if (!this.likedGames) return [];

      // Use Firebase sort order if available, otherwise fall back to client-side sorting
      if (this.gamesSortOrder?.gameIds?.length > 0 && this.gamesSortOrder.sortBy === this.sortBy) {
        const sorted = this.gamesSortOrder.gameIds
          .map(id => this.cachedGames?.[id])
          .filter(game => game);
        return this.sortOrder === 'desc' ? sorted.reverse() : sorted;
      }

      // Fallback to client-side sorting
      return this.sortGames(this.likedGames);
    },

    likedGamesIds() {
      return Object.entries(this.games)?.filter(([liked]) => liked)?.map(([id]) => Number(id));
    },

    sortOptions() {
      return [
        { value: 'name', label: 'Name', icon: 'fa-solid fa-font' },
        { value: 'progress', label: 'Progress', icon: 'fa-solid fa-percent' },
        { value: 'tags', label: 'Tags', icon: 'fa-solid fa-tags' },
        { value: 'dateAdded', label: 'Date Added', icon: 'fa-solid fa-calendar' },
      ];
    },
  },

  watch: {
    games() {
      if (this.highlightedGame) this.highlightGame(this.highlightedGame);
    },
  },

  mounted() {
    if (this.user) {
      this.loadGames();
    } else {
      this.loading = false;
    }

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
        this.loading = true;

        // Load games with Firebase-level sorting
        await this.$store.dispatch('LOAD_GAMES_SORTED', {
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        });

        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = Object.keys(this.games)?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (gamesNotCached) {
          await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);

          // Save game metadata for newly cached games
          for (const gameId of gamesNotCached.split(',')) {
            if (this.games[gameId]) {
              await this.$store.dispatch('SAVE_USER_GAME', {
                gameId: gameId.trim(),
                gameData: this.cachedGames[gameId],
              });
            }
          }
        }
      } catch (e) {
        // Fallback to regular loading if sorted loading fails
        await this.$store.dispatch('LOAD_GAMES');
      } finally {
        this.loading = false;
      }
    },

    async changeSort(sortBy) {
      if (this.sortBy === sortBy) {
        // Toggle sort order if same field
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = sortBy;
        this.sortOrder = 'asc';
      }

      // Reload with new sort
      await this.loadGames();
    },

    sortGames(games) {
      const sorted = [...games];

      switch (this.sortBy) {
        case 'name':
          sorted.sort((a, b) => {
            const nameA = (a?.name || '').toLowerCase();
            const nameB = (b?.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          break;
        case 'progress':
          sorted.sort((a, b) => {
            const progressA = this.progresses?.[a?.id] || 0;
            const progressB = this.progresses?.[b?.id] || 0;
            return progressA - progressB;
          });
          break;
        case 'tags':
          sorted.sort((a, b) => {
            const tagsA = this.getGameTagCount(a?.id);
            const tagsB = this.getGameTagCount(b?.id);
            return tagsA - tagsB;
          });
          break;
        case 'dateAdded':
          // Use Firebase sort order if available
          if (this.gamesSortOrder?.gameIds?.length > 0) {
            const orderMap = {};
            this.gamesSortOrder.gameIds.forEach((id, index) => {
              orderMap[id] = index;
            });
            sorted.sort((a, b) => {
              const orderA = orderMap[a?.id] ?? 9999;
              const orderB = orderMap[b?.id] ?? 9999;
              return orderA - orderB;
            });
          }
          break;
      }

      return this.sortOrder === 'desc' ? sorted.reverse() : sorted;
    },

    getGameTagCount(gameId) {
      const tags = this.$store.state.tags?.tags || this.$store.state.tags || [];
      return tags.filter(tag => tag?.games?.includes(Number(gameId))).length;
    },
  },
};
</script>
