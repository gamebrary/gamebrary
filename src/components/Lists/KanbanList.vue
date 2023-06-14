<!-- TODO: Fix issue with grid not loading correctly -->
<template lang="html">
  <div
    :class="['list rounded pr-3', listView, { dragging, 'unique': singleList, 'pr-3': isLastList && isPublicBoard }]"
    :id="listIndex"
  >
    <b-card
      no-body
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
    >
      <b-dropdown
        v-if="isBoardOwner"
        id="dropdown-1"
        :variant="darkTheme ? 'dark' : 'light'"
        class="mt-1 mx-2"
        size="sm"
        no-caret
        block
      >
        <template #button-content>
          <strong>{{ list.name }}</strong>
        </template>

        <b-dropdown-text v-if="sortingEnabled">
          <small>Auto sort enabled ({{ sortOrder }})</small>
        </b-dropdown-text>

        <b-dropdown-text v-if="list.games.length">
          <small>{{ list.games.length }} games</small>
        </b-dropdown-text>

        <b-dropdown-divider />

        <b-dropdown-item-button
          @click="editList"
        >
          Edit list
        </b-dropdown-item-button>

        <b-dropdown-item disabled>Delete list</b-dropdown-item>

        <game-selector
          v-if="isBoardOwner && !isEmpty"
          :title="`Add games to ${list.name}`"
          size="sm"
          trigger-component="b-dropdown-item-button"
          :filter="list.games"
          @select-game="selectGame"
        >
          Add games
        </game-selector>
      </b-dropdown>

      <draggable
        class="games px-2 pt-1"
        handle=".card"
        ghost-class="card-placeholder"
        drag-class="border-success"
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
          :ref="`${listIndex}-${gameId}`"
          :id="gameId"
          :is="gameCardComponent"
          :key="gameId"
          :list-index="listIndex"
          :list="list"
          :game-id="gameId"
          :class="{ 'mb-2': listView !== 'covers', 'highlighted': highlightedGame == gameId }"
          @click.native="openGame(gameId, list)"
        />

        <game-selector
          v-if="isEmpty && isBoardOwner"
          class="mb-2"
          block
          trigger-text="Add games"
          :variant="darkTheme ? 'success' : 'primary'"
          size="sm"
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
      editing: false,
      localList: {},
      gameCardComponents: {
        single: 'GameCardDefault',
        covers: 'GameCardCovers',
        grid: 'GameCardGrid',
        compact: 'GameCardCompact',
        text: 'GameCardText',
      },
    };
  },

  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.list));
  },

  computed: {
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings', 'highlightedGame']),
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
        case SORT_TYPE_RATING: return orderby(games, [game => this.cachedGames?.[game]?.rating || 0], ['desc']);
        case SORT_TYPE_ALPHABETICALLY: return orderby(games, [game => this.cachedGames?.[game]?.name]);
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
    editList() {
      this.$bus.$emit('EDIT_LIST', this.listIndex);
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
        }, 5000);
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  flex-shrink: 0;
  cursor: default;
  // position: relative;
  // height: auto;
  // max-height: calc(100vh - 200px);
  // min-height: 200px;
  width: calc(300px + 1rem);
  // overflow-y: auto;

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
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    width: 100%;

    @media(max-width: 768px) {
      max-height: 70vh;
    }
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

.highlighted {
  outline: 3px dashed var(--primary);
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
