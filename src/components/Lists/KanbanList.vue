<template lang="html">
  <div
    :class="['list pr-3', { dragging, 'unique': singleList, 'pr-3': isLastList && isPublicBoard }]"
    :id="listIndex"
  >
    <b-card
      no-body
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :class="[darkTheme ? 'dark' : 'light', transparencyEnabled ? 'semi-transparent' : '']"
      :text-variant="darkTheme ? 'light' : 'dark'"
    >
      <b-button-group class="m-2">
        <b-button
          v-if="isBoardOwner"
          v-b-tooltip.hover="'Edit list'"
          class="text-left"
          :variant="darkTheme ? 'dark' : 'light'"
          @click="editList"
        >
          <div class="d-flex justify-content-between align-items-center">
            {{ list.name }}

            <i
              v-if="sortingEnabled"
              v-b-tooltip.hover
              class="fa-regular fa-sort ml-auto"
              :class="darkTheme ? 'text-success' : 'text-primary'"
              :title="sortMessage"
            />

            <span v-if="list.showGameCount" class="ml-3">
              {{ gameCount }}
            </span>
          </div>
        </b-button>

        <b-button
          v-else
          size="sm"
          :variant="darkTheme ? 'dark' : 'light'"
        >
          <strong>{{ list.name }}</strong>
        </b-button>

        <b-button-group>
          <b-button
            v-if="listIndex > 0"
            :variant="darkTheme ? 'dark' : 'light'"
            v-b-tooltip.hover="'Move left'"
            @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)"
          >
            <i class="fa-regular fa-caret-left fa-fw" />
          </b-button>

          <b-button
            v-if="showMoveListRightButton"
            :variant="darkTheme ? 'dark' : 'light'"
            v-b-tooltip.hover="'Move right'"
            @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)"
          >
            <i class="fa-regular fa-caret-right fa-fw" />
          </b-button>
        </b-button-group>
      </b-button-group>

      <draggable
        class="games px-2 pt-1"
        handle=".game-card"
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
        <!-- <pre>{{  }}</pre> -->
        <GameCard
          v-for="gameId in sortedGames"
          :ref="`${listIndex}-${gameId}`"
          :game-id="gameId"
          :key="gameId"
          :list-index="listIndex"
          :list="list"
          class="mb-3"
          :vertical="list.vertical"
          :small="list.smallCover"
          :hide-cover="list.hideCover"
          :hide-title="list.hideTitle"
          :class="{ 'highlighted': highlightedGame == gameId }"
          @click.native="openGame(gameId, list)"
        />
      </draggable>

      <b-button
        title="Add games"
        v-b-tooltip.hover
        class="mx-2 mb-2"
        :variant="darkTheme ? 'outline-success' : 'light'"
        :class="darkTheme ? 'border-0' : ''"
        @click="openGameSelectorSidebar"
      >
        <i class="fa-solid fa-plus" />
      </b-button>
    </b-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GameCard from '@/components/GameCard';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import { SORT_TYPE_ALPHABETICALLY, SORT_TYPE_RATING, SORT_TYPE_PROGRESS } from '@/constants';
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
  },

  destroyed() {
    this.$bus.$off(this.gameSelectorEventName, this.selectGame);
  },

  computed: {
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings', 'highlightedGame']),
    ...mapGetters(['isBoardOwner', 'darkTheme', 'transparencyEnabled']),

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
