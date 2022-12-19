<!-- TODO: fix board height when short lists -->
<!-- TODO: Fix issue with grid not loading correctly -->
<template lang="html">
  <div
    :class="['list rounded pl-3', listView, { dragging, 'unique': singleList, 'pr-3': isLastList && isPublicBoard }]"
    :id="listIndex"
  >
    <b-card
      no-body
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
    >
      <b-button-toolbar
        key-nav
        class="p-2"
      >
        <b-badge
          v-if="showGameCount"
          class="align-self-center mr-1"
          :variant="darkTheme ? 'dark' : 'info'"
        >
          {{ list.games.length }}
        </b-badge>

        <b-badge
          v-if="sortingEnabled"
          class="align-self-center mr-1"
          :variant="darkTheme ? 'dark' : 'info'"
          v-b-tooltip.hover
          :title="`${$t('board.list.sortedBy')}${sortOrder}`"
        >
          <i class="fa-solid fa-sort fa-fw" />
        </b-badge>

        <b-button
          @click="$router.push({ name: 'board.edit', params: { id: board.id } })"
          :disabled="!isBoardOwner"
          class="mr-1 px-2 text-left"
          size="sm"
          style="flex: 1"
          :variant="darkTheme ? 'dark' : 'light'"
        >
          {{ list.name }}
        </b-button>

        <game-selector
          v-if="isBoardOwner && !isEmpty"
          :title="`Add games to ${list.name}`"
          class="ml-auto"
          size="sm"
          :variant="darkTheme ? 'dark' : 'light'"
          :filter="list.games"
          @select-game="selectGame"
        >
          <i class="fa-solid fa-plus fa-fw" />
        </game-selector>
      </b-button-toolbar>

      <draggable
        :class="['games', isEmpty ? 'pt-3' : '']"
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
          :ref="gameId"
          :id="gameId"
          :is="gameCardComponent"
          :key="gameId"
          :list="list"
          :game-id="gameId"
          :class="{ 'mb-2': listView !== 'covers', 'border-success': highlightedGame == gameId }"
          @click.native="openGame(gameId, list)"
        />

        <game-selector
          v-if="isEmpty && isBoardOwner"
          class="mb-2"
          block
          trigger-text="Add games"
          variant="primary"
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
import { LIST_VIEW_SINGLE, SORT_TYPE_ALPHABETICALLY, SORT_TYPE_RATING, SORT_TYPE_PROGRESS } from '@/constants';
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
  },

  data() {
    return {
      draggingId: null,
      highlightedGame: null,
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

    isLastList() {
      return this.board?.lists?.length - 1 === this.listIndex;
    },

    isPublicBoard() {
      return this.board?.isPublic;
    },

    sortingEnabled() {
      return [SORT_TYPE_PROGRESS, SORT_TYPE_RATING, SORT_TYPE_ALPHABETICALLY].includes(this.sortOrder);
    },

    sortOrder() {
      return this.list?.sortOrder;
    },

    sortedGames() {
      const { sortOrder, games } = this.list;

      switch (sortOrder) {
        case SORT_TYPE_PROGRESS: return orderby(games, [game => this.progresses?.[game] || 0], ['desc']);
        case SORT_TYPE_RATING: return orderby(games, [game => this.games?.[game]?.rating || 0], ['desc']);
        case SORT_TYPE_ALPHABETICALLY: return orderby(games, [game => this.games?.[game]?.name]);
        default: return this.list?.games || [];
      }
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

    gameCardComponent() {
      const availableViews = Object.keys(this.gameCardComponents);

      return availableViews?.includes(this.listView)
        ? this.gameCardComponents[this.listView]
        : 'GameCardDefault';
    },

    listView() {
      return this.list?.view || LIST_VIEW_SINGLE;
    },
  },

  methods: {
    selectGame(gameId) {
      return this.list.games.includes(gameId)
        ? this.removeGame(gameId)
        : this.addGame(gameId);
    },

    async addGame(gameId) {
      await this.$store.dispatch('LOAD_GAMES', [gameId]);
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
      this.highlightedGame = gameId;

      const [gameRef] = this.$refs[gameId];

      gameRef.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        this.highlightedGame = null;
      }, 2000);
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
