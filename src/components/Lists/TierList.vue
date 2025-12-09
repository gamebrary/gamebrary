<template lang="html">
  <div class="d-flex w-100 align-items-start mb-2 pl-3">
    <!-- Mobile controls -->
    <div class="d-flex flex-column d-md-none">
      <div
        class="rounded-circle cursor-pointer d-flex align-items-center justify-content-center"
        :title="list.name"
        :style="`background-color: ${list.backgroundColor}; width: 92px; height: 92px;`"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        @click="editList"
      >
        <span class="fw-bold">{{ tierLetter }}</span>
      </div>

      <div
        v-if="user && isBoardOwner"
        class="btn-group btn-group-sm mt-1"
        role="group"
      >
        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="listIndex === 0"
          :title="'Move up'"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)"
        >
          <i class="fa-regular fa-caret-up fa-fw" />
        </button>

        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :title="`Add games to ${list.name}`"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="openGameSelectorSidebar"
        >
          <i class="fa-solid fa-plus fa-fw" />
        </button>

        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="moveListRightButtonDisabled"
          :title="'Move down'"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)"
        >
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
      </div>
    </div>

    <div class="d-none d-md-flex">
      <div
        class="rounded-circle cursor-pointer d-flex align-items-center justify-content-center"
        :title="list.name"
        :style="`background-color: ${list.backgroundColor}; width: 128px; height: 128px;`"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        @click="editList"
      >
        <span class="fw-bold fs-4">{{ tierLetter }}</span>
      </div>

      <div
        v-if="user && isBoardOwner"
        class="btn-group-vertical btn-group-sm ms-2"
        role="group"
      >
        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="listIndex === 0"
          :title="'Move up'"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)"
        >
          <i class="fa-regular fa-caret-up fa-fw" />
        </button>

        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :title="`Add games to ${list.name}`"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="openGameSelectorSidebar"
        >
          <i class="fa-solid fa-plus fa-fw" />
        </button>

        <button
          type="button"
          class="btn"
          :class="tierActionVariant === 'light' ? 'btn-light' : tierActionVariant === 'secondary' ? 'btn-secondary' : 'btn-outline-light'"
          :disabled="moveListRightButtonDisabled"
          :title="'Move down'"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)"
        >
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
      </div>
    </div>

    <draggable
      class="tier-game w-100 d-flex ml-2"
      v-bind="draggableProps"
      :list="list.games"
      :id="listIndex"
      :item-key="(gameId) => gameId"
      :move="validateMove"
      :disabled="draggingDisabled"
      @end="dragEnd"
      @start="dragStart"
    >
      <template #item="{ element: gameId }">
        <GameCard
          :key="gameId"
          :game-id="gameId"
          :ref="`${listIndex}-${gameId}`"
          hide-title
          hide-tags
          hide-notes
          hide-progress
          hide-platforms
          class="mr-2 mb-2"
          vertical
          slim
          fluid
          small
        />
      </template>
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
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  destroyed() {
    this.$bus.$off(this.gameSelectorEventName, this.selectGame);
  },

  computed: {
    ...mapState(['dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner', 'draggableProps']),

    moveListRightButtonDisabled() {
      const listsCount = this.board?.lists?.length || 0;

      return this.listIndex >= listsCount - 1;
    },

    tierLetter() {
      return this.list.name?.charAt(0);
    },

    tierActionVariant() {
      if (this.board?.backgroundUrl) {
        return this.darkTheme ? 'light' : 'secondary';
      }

      return this.darkTheme ? 'outline-light' : 'secondary';
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

    initTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
          }
        });
      });
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
