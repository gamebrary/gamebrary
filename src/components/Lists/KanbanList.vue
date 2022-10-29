<template lang="html">
  <div
    :class="[
      'list rounded pr-3',
      listView,
      {
        dragging,
        'unique': singleList,
      }
      ]"
    :id="listIndex"
  >
    <b-card
      no-body
      :bg-variant="darkTheme ? 'info' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
    >
      <header class="p-2 pr-0 d-flex justify-content-between">
        <b-button
          block
          size="sm"
          :variant="darkTheme ? 'info' : 'transparent'"
          class="d-flex justify-content-between align-items-center pl-0"
          :disabled="preview || !isBoardOwner"
          :to="{ name: 'board.edit', params: { id: board.id } }"
        >
          <span>
            <b-badge
              v-if="!showGameCount"
              :variant="darkTheme ? 'dark' : 'info'"
            >
              {{ list.games.length }}
            </b-badge>

            {{ list.name }}
          </span>

          <b-badge
            v-if="autoSortEnabled"
            :variant="darkTheme ? 'danger' : 'warning'"
            v-b-tooltip.hover
            :title="`${$t('board.list.sortedBy')} ${$t(`board.list.${sortOrder}`)}`"
          >
            <i class="fa-solid fa-sort fa-fw" />
          </b-badge>
        </b-button>

        <game-selector
          v-if="isBoardOwner"
          class="mb-2"
          title="Add games"
          :variant="darkTheme ? 'info' : 'transparent'"
          :filter="list.games"
          @select-game="selectGame"
        >
          <i class="fa-solid fa-plus fa-fw" />
        </game-selector>
      </header>

      <draggable
        class="games"
        handle=".card"
        ghost-class="card-placeholder"
        drag-class="border-selected"
        chosen-class="border-primary"
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
        <component
          v-for="gameId in sortedGames"
          :id="gameId"
          :is="gameCardComponent"
          :key="gameId"
          :list="list"
          :game-id="gameId"
          :class="{ 'mb-2': view !== 'covers'}"
          v-b-toggle.game-sidebar
          @click.native="openGame(gameId, list)"
        />

        <game-selector
          v-if="isEmpty && isBoardOwner"
          class="mb-2"
          :variant="darkTheme ? 'secondary' : 'warning'"
          :filter="list.games"
          @select-game="selectGame"
        />
      </draggable>
    </b-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GameSelector from '@/components/GameSelector';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardCovers from '@/components/GameCards/GameCardCovers';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import { DEFAULT_LIST_VIEW } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameSelector,
    GameCardDefault,
    GameCardCovers,
    GameCardGrid,
    GameCardCompact,
    GameCardText,
    draggable,
  },

  props: {
    list: {
      type: Object,
      default: () => {},
    },
    listIndex: Number,
    preview: Boolean,
  },

  data() {
    return {
      draggingId: null,
      editing: false,
      gameCardComponents: {
        single: 'GameCardDefault',
        covers: 'GameCardCovers',
        grid: 'GameCardGrid',
        compact: 'GameCardCompact',
        text: 'GameCardText',
      },
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.sortOrder);
    },

    sortOrder() {
      return this.list?.settings?.sortOrder;
    },

    sortedGames() {
      const { settings, games } = this.list;
      const sortOrder = settings?.sortOrder || 'sortByCustom';

      switch (sortOrder) {
      case 'sortByCustom': return this.list.games;
      case 'sortByProgress': return orderby(games, [game => this.progresses[game] || 0], ['desc']);
      case 'sortByRating': return orderby(games, [game => this.games[game].rating || 0], ['desc']);
      case 'sortByName': return orderby(games, [game => this.games[game].name]);
      default:
        return this.list.games;
      }
    },

    isEmpty() {
      return this.list.games.length === 0;
    },

    singleList() {
      return this.board.lists.length === 1;
    },

    view() {
      return this.list?.settings?.view;
    },

    showGameCount() {
      return this.list?.settings?.showGameCount;
    },

    gameCardComponent() {
      const availableViews = Object.keys(this.gameCardComponents);

      return this.view && availableViews.includes(this.view)
        ? this.gameCardComponents[this.view]
        : 'GameCardDefault';
    },

    listView() {
      return this.list?.settings?.view || DEFAULT_LIST_VIEW;
    },
  },

  methods: {
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
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
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
      const slug = slugify(this.games[id].slug, { lower: true });

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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  flex-shrink: 0;
  cursor: default;
  position: relative;
  height: auto;
  min-height: 200px;
  width: calc(300px + 1rem);

  @media(max-width: 400px) {
    width: calc(100vw - calc(68px + .5rem));
  }

  &.unique {
    @media(max-width: 400px) {
      width: calc(100vw - calc(58px + .5rem));
    }
  }

  .games {
    height: 100%;
    overflow: hidden;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0 .5rem;
    width: 100%;
  }

  &.grid {
    .games {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: .5rem;
    }
  }

  &.covers {
    .games {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: .5rem;

      img {
        width: 100%;
        padding-bottom: .5rem;
      }
    }
  }
}

.list-settings {
  padding: 1rem;
}
</style>

<style lang="scss" rel="stylesheet/scss">
.card-placeholder {
  > div {
    visibility: hidden !important;
  }

  img {
    display: none !important;
  }

  height: 100px;
  opacity: .1;
  background: #000;
}
</style>
