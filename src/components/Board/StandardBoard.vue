<template lang="html">
  <div class="standard-board pb-5 d-flex align-items-center flex-column">
    <p v-if="isEmpty">
      This board is empty.
    </p>

    <draggable
      class="games"
      handle=".game-card"
      ghost-class="card-placeholder"
      drag-class="border-success"
      chosen-class="border-primary"
      filter=".drag-filter"
      delay="50"
      animation="500"
      :list="listGames"
      :move="validateMove"
      :disabled="draggingDisabled"
      :group="{ name: 'games' }"
      @end="dragEnd"
      @start="dragStart"
    >
      <GameCard
        v-for="(gameId, index) in listGames"
        :key="index"
        :list="list"
        :ref="gameId"
        :game-id="gameId"
        :ranked="board.ranked"
        :rank="index + 1"
        class="mb-3"
        @click.native="openGame(gameId, list)"
      />

      <b-button
        v-if="isBoardOwner"
        class="py-3"
        block
        :variant="darkTheme ? 'success' : 'primary'"
        @click="openGameSelectorSidebar"
      >
        Add games
      </b-button>
    </draggable>
  </div>
</template>

<script>
import { HIGHLIGHTED_GAME_TIMEOUT } from '@/constants';
import draggable from 'vuedraggable';
import slugify from 'slugify'
import { mapState, mapGetters } from 'vuex';
import GameCard from '@/components/GameCard';

export default {
  components: {
    draggable,
    GameCard,
  },

  computed: {
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings', 'highlightedGame']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    list() {
      const [firstList] = this.board?.lists;

      return firstList || [];
    },

    needsFlattening() {
      return this.board?.lists?.length > 0;
    },

    filter() {
      return this.listGames || [];
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    listGames() {
      return this.list?.games;
    },

    isEmpty() {
      return this.listGames.length === 0;
    },

    gameSelectorEventName() {
      return `SELECT_GAME_LIST_${this.listIndex}`;
    },
  },

  mounted() {
    if (this.needsFlattening) this.flattenAndSaveBoard();
    if (this.highlightedGame) this.highlightGame();

    this.$bus.$on(this.gameSelectorEventName, this.selectGame);
  },

  destroyed() {
    this.$bus.$off(this.gameSelectorEventName, this.selectGame);
  },

  methods: {
    highlightGame() {
      // TODO: update this to work
      // const lists = Object.values(this.$refs);

      // lists.forEach(([list], index) => {
      //   console.log('list.$refs', list.$refs);

      //   const [gameRef] = list.$refs[this.highlightedGame];

      //   if (gameRef) {
      //     console.log('gameRef', gameRef);

      //     setTimeout(() => {
      //       gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      //     }, index * 1000);
      //   }
      // });

      setTimeout(() => {
        this.$store.commit('SET_HIGHLIGHTED_GAME', null);
      }, HIGHLIGHTED_GAME_TIMEOUT);
    },

    async flattenAndSaveBoard() {
      const mergedGamesList = [...new Set(this.board?.lists?.map(({ games }) => games)?.flat())];

      const payload = {
        ...this.board,
        lastUpdated: Date.now(),
        lists: [{ name: '', games: mergedGamesList }],
      }

      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD');
    },

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
  }
};
</script>

<style lang="scss" scoped>
.standard-board {
  width: 100%;
  max-width: 600px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  flex-direction: column;
  margin: 0 auto;
}
</style>
