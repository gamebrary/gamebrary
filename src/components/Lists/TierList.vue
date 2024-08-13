<template lang="html">
  <div class="d-flex w-100 align-items-start mb-2">
    <div class="d-flex">
      <b-avatar
        variant="primary"
        :text="tierLetter"
        :title="list.name"
        rounded
        v-b-tooltip.hover.right
        class="cursor-pointer"
        :style="`background-color: ${list.backgroundColor}`"
        size="100"
        @click.native="editList"
      />

      <b-button-group
        v-if="user && isBoardOwner"
        size="sm"
        vertical
        class="ml-2"
      >
        <!-- :disabled="listIndex === 0" -->
        <!-- TODO: hook up move list up/down -->
        <b-button
          class="border-0"
          v-b-tooltip.hover.right="'Move up'"
          disabled
          :variant="darkTheme ? 'outline-light' : 'outline-secondary'"
        >
          <i class="fa-regular fa-caret-up fa-fw" />
        </b-button>

        <b-button
          class="border-0"
          v-b-tooltip.hover.right
          :title="`Add games to ${list.name}`"
          :variant="darkTheme ? 'outline-light' : 'outline-secondary'"
          @click="openGameSelectorSidebar"
        >
          <i class="fa-solid fa-plus fa-fw" />
        </b-button>

        <b-button
          class="border-0"
          v-b-tooltip.hover.right="'Move down'"
          :variant="darkTheme ? 'outline-light' : 'outline-secondary'"
        >
          <i class="fa-regular fa-caret-down fa-fw" />
        </b-button>
      </b-button-group>
    </div>

    <draggable
      handle=".game-card"
      ghost-class="card-placeholder"
      drag-class="border-success"
      chosen-class="border-primary"
      class="tier-game w-100 d-flex ml-2"
      filter=".drag-filter"
      delay="50"
      animation="500"
      :list="list.games"
      :id="listIndex"
      :move="validateMove"
      :disabled="draggingDisabled"
      :group="{ name: 'games' }"
      @end="dragEnd"
      @start="dragStart"
    > 
      <GameCard
        v-for="gameId in list.games"
        :key="gameId"
        :game-id="gameId"
        hide-title
        hide-tags
        hide-notes
        hide-progress
        hide-platforms
        class="mr-2"
        vertical
        slim
        small
      />
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapState, mapGetters } from 'vuex';
import GameCard from '@/components/GameCard';

export default {
  components: {
    GameCard,
    draggable,
  },

  props: {
    allGames: Array,
    list: {
      type: Object,
      default: () => {},
    },
    listIndex: Number,
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
    ...mapState(['dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner']),

    tierLetter() {
      return this.list.name?.charAt(0);
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
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
        title: `Add games to ${this.list.name}`,
        filter: this.list.games,
        eventName: this.gameSelectorEventName,
      });
    },

    selectGame(gameId) {
      return this.list.games.includes(gameId)
        ? this.removeGame(gameId)
        : this.addGame(gameId);
    },

    async addGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board?.lists?.[this.listIndex]?.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board.id);
        await this.$store.dispatch('LOAD_IGDB_GAMES', [gameId]);
        this.$bvToast.toast('Game added');
      } catch (e) {
        this.$bvToast.toast('There was an error adding game', { variant: 'danger' });
      }
    },

    async removeGame() {
      const { boardId, listIndex } = this.$route?.query;
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board?.lists?.[listIndex]?.games?.indexOf(this.gameId);

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board.id)
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
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
      try {
        await this.$store.dispatch('SAVE_BOARD');
      } catch (e) {
        this.$store.commit('SET_SESSION_EXPIRED', true);
      }
    },

    editList() {
      if (this.user && this.isBoardOwner) this.$store.commit('SET_ACTIVE_BOARD_LIST_INDEX', this.listIndex);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tier-game {
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
