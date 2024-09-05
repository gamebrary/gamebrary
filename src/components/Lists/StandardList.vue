<template lang="html">
  <div class="standard-list" :class="{ 'grid': isGrid }"  >
    <p v-if="isEmpty">
      This board is empty.
    </p>

    <draggable
      class="games"
      :class="{ 'game-grid': isGrid }"
      handle=".card"
      ghost-class="card-placeholder"
      drag-class="border-success"
      chosen-class="border-primary"
      filter=".drag-filter"
      delay="50"
      animation="500"
      :list="list.games"
      :move="validateMove"
      :disabled="draggingDisabled"
      :group="{ name: 'games' }"
      @end="dragEnd"
      @start="dragStart"
    >
      <GameCard
        v-for="(game, index) in listGames"
        :key="index"
        :list="list"
        :ref="`${listIndex}-${game.id}`"
        :game-id="game.id"
        :ranked="board.ranked"
        :rank="index + 1"
        :vertical="board.grid"
        :hide-platforms="board.grid"
        :class="isGrid ? null: 'mb-3'"
        @click.native="openGame(game.id, list)"
      />
    </draggable>

    <b-button
      v-if="isBoardOwner"
      class="my-3"
      variant="primary"
      @click="openGameSelectorSidebar"
    >
      Add games
    </b-button>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import slugify from 'slugify'
import { mapState, mapGetters } from 'vuex';
import GameCard from '@/components/GameCard';

export default {
  components: {
    draggable,
    GameCard,
  },

  props: {
    listIndex: Number,
    list: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      draggingId: null,
      editing: false,
    };
  },

  mounted() {
    this.$bus.$on(this.gameSelectorEventName, this.selectGame);
  },

  destroyed() {
    this.$bus.$off(this.gameSelectorEventName, this.selectGame);
  },

  computed: {
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    isGrid() {
      return this.board?.grid;
    },

    filter() {
      return this.list?.games || [];
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.list?.sortOrder);
    },

    listGames() {
      return this.list?.games?.map((id) => this.cachedGames?.[id]) || []
        .filter(({ id }) => Boolean(id));
    },

    isEmpty() {
      return this.list.games.length === 0;
    },

    gameSelectorEventName() {
      return `SELECT_GAME_LIST_${this.listIndex}`;
    },
  },

  methods: {
    openGameSelectorSidebar() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: `Add games to ${this.board.name}`,
        filter: this.filter,
        eventName: this.gameSelectorEventName,
      })
    },

    selectGame(gameId) {
      if (this.list.games.includes(gameId)) {
        this.removeGame(gameId);
      } else {
        this.addGame(gameId);
      }
    },

    async addGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board?.lists?.[0]?.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board?.id);
        await this.$store.dispatch('LOAD_IGDB_GAMES', [gameId]);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

    async removeGame(gameId) {
      const { boardId, listIndex } = this.$route?.query;
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board?.lists?.[listIndex]?.games?.indexOf(gameId);

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board?.id)
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

    openGame(id, list) {
      const slug = slugify(this.cachedGames[id].slug, { lower: true });

      this.$router.push({
        name: 'game',
        params: {
          id,
          slug,
          boardId: this.board?.id,
        },
      });
    },

    validateMove({ from, to }) {
      const sameList = from.id === to.id;
      const notInList = !this.board?.lists?.[to.id]?.games?.includes(Number(this.draggingId));

      return sameList || notInList && !sameList;
    },

    dragStart({ item }) {
      this.$store.commit('SET_DRAGGING_STATUS', true);
      this.draggingId = item.id;
    },

    dragEnd() {
      this.$store.commit('SET_DRAGGING_STATUS', false);
      this.saveBoard();
    },

    async saveBoard() {
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.game-cover {
  width: 120px;
}

.standard-list {
  width: 100%;
  max-width: 600px;
  overflow-x: hidden;

  &.grid {
    max-width: 1280px;
  }
}
</style>
