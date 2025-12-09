<template lang="html">
  <div
    :class="['list pr-3', { dragging, 'unique': singleList, 'pr-3': isLastList && isPublicBoard }]"
    :id="listIndex"
  >
    <div
      class="card"
      :class="[darkTheme ? 'bg-black text-light' : 'bg-light text-dark', transparencyEnabled ? 'semi-transparent' : '']"
    >
      <div v-if="isBoardOwner" class="p-2">
        <div class="dropdown">
          <button
            class="btn dropdown-toggle"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            type="button"
            :id="`listDropdown-${listIndex}`"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="border: none;"
          >
            <h4 class="d-flex align-items-center m-0">
              <i
                v-if="sortingEnabled"
                class="fa-regular fa-sort fa-fw me-1"
                :class="darkTheme ? 'text-success' : 'text-primary'"
                :title="sortMessage"
                data-bs-toggle="tooltip"
              />

              {{ truncatedListName || 'Untitled list' }}
              <template v-if="list.showGameCount">
                ({{ gameCount }})
              </template>
            </h4>
          </button>
          <ul class="dropdown-menu" :aria-labelledby="`listDropdown-${listIndex}`">
            <li>
              <button
                type="button"
                class="dropdown-item"
                :class="darkTheme ? 'text-light' : ''"
                @click="editList"
              >
                <i class="fa-solid fa-pen fa-fw" />
                Edit list
              </button>
            </li>

            <template v-if="isBoardOwner && (listIndex > 0 || showMoveListRightButton)">
              <li v-if="listIndex > 0">
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)"
                >
                  <i class="fa-regular fa-caret-left fa-fw" />
                  Move left
                </button>
              </li>

              <li v-if="showMoveListRightButton">
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)"
                >
                  <i class="fa-regular fa-caret-right fa-fw" />
                  Move right
                </button>
              </li>
            </template>

            <li v-if="isBoardOwner">
              <button
                type="button"
                class="dropdown-item"
                :class="darkTheme ? 'text-light' : ''"
                @click="openGameSelectorSidebar"
              >
                <i class="fa-solid fa-plus fa-fw" />
                Add games
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button
        v-else
        type="button"
        class="btn btn-sm disabled text-start"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
      >
        <strong>{{ list.name }}</strong>
      </button>

      <draggable
        class="games px-2 pt-1"
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
            :ref="`${listIndex}-${gameId}`"
            :game-id="gameId"
            :key="gameId"
            :list-index="listIndex"
            :list="list"
            class="mb-2"
            :vertical="list.vertical"
            :small="list.smallCover"
            :hide-cover="list.hideCover"
            :hide-title="list.hideTitle"
            @click.native="openGame(gameId, list)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GameCard from '@/components/GameCard';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import {
  SORT_TYPE_ALPHABETICALLY,
  SORT_TYPE_RATING,
  SORT_TYPE_PROGRESS,
  HIGHLIGHTED_GAME_TIMEOUT
} from '@/constants';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCard,
    draggable,
  },

  props: {
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
      localList: {},
    };
  },

  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.list));

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
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner', 'darkTheme', 'transparencyEnabled', 'draggableProps', 'buttonProps']),

    sortMessage() {
      if (this.sortBy === SORT_TYPE_ALPHABETICALLY) return 'List sorted alphabetically'
      if (this.sortBy === SORT_TYPE_RATING) return 'List sorted by rating'
      if (this.sortBy === SORT_TYPE_PROGRESS) return 'List sorted by progress'

      return null;
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    isLastList() {
      return this.board?.lists?.length - 1 === this.listIndex;
    },

    isPublicBoard() {
      return this.board?.isPublic;
    },

    sortingEnabled() {
      return [SORT_TYPE_PROGRESS, SORT_TYPE_RATING, SORT_TYPE_ALPHABETICALLY].includes(this.sortBy);
    },

    sortBy() {
      return this.list?.sortBy;
    },

    sortedGames() {
      switch (this.list?.sortBy) {
        case SORT_TYPE_PROGRESS: return orderby(this.list?.games, [game => this.progresses?.[game] || 0], ['desc']);
        case SORT_TYPE_RATING: return orderby(this.list?.games, [game => this.cachedGames?.[game]?.rating || 0], ['desc']);
        case SORT_TYPE_ALPHABETICALLY: return orderby(this.list?.games, [game => this.cachedGames?.[game]?.name]);
        default: return this.list?.games || [];
      }
    },

    showMoveListRightButton() {
      const listsCount = this.board?.lists?.length || 0;

      return this.listIndex < listsCount - 1;
    },

    isEmpty() {
      return this.list?.games?.length === 0;
    },

    singleList() {
      return this.board.lists.length === 1;
    },

    showGameCount() {
      return this.list?.showGameCount;
    },

    gameCount() {
      return this.list?.games?.length || 0;
    },

    gameSelectorEventName() {
      return `SELECT_GAME_LIST_${this.listIndex}`;
    },

    truncatedListName() {
      return this.list.name?.length > 28 ? `${this.list.name.substring(0, 28)}...` : this.list.name;
    },
  },

  methods: {
    editList() {
      this.$store.commit('SET_ACTIVE_BOARD_LIST_INDEX', this.listIndex);
    },

    openGameSelectorSidebar() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: `Add games to ${this.list.name}`,
        filter: this.list.games,
        eventName: this.gameSelectorEventName,
      })
    },

    selectGame(gameId) {
      return this.list.games.includes(gameId)
        ? this.removeGame(gameId)
        : this.addGame(gameId);
    },

    async addGame(gameId) {
      await this.$store.dispatch('LOAD_IGDB_GAMES', [gameId]);
      const board = JSON.parse(JSON.stringify(this.board));

      board?.lists?.[this.listIndex]?.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }

      this.highlightGame(gameId);
    },

    highlightGame(gameId) {
      this.$store.commit('SET_HIGHLIGHTED_GAME', gameId);

      const gameRef = this.$refs[`${this.listIndex}-${gameId}`]?.[0];

      if (gameRef) {
        gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          this.$store.commit('SET_HIGHLIGHTED_GAME', null);
        }, HIGHLIGHTED_GAME_TIMEOUT);
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

    openGame(id, list) {
      const slug = slugify(this.cachedGames[id].slug, { lower: true });

      this.$router.push({
        name: 'game',
        params: {
          id,
          slug,
          boardId: this.board.id,
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
.list {
  flex-shrink: 0;
  cursor: default;
  width: calc(380px + 1rem);

  @media(max-width: 400px) {
    width: calc(100vw - calc(68px + .5rem));
  }

  &.unique {
    @media(max-width: 400px) {
      width: calc(100vw - calc(58px + .5rem));
    }
  }

  .games {
    overflow: hidden;
    max-height: calc(100dvh - 162px);
    overflow-y: auto;
    width: 100%;
  }
}
</style>
