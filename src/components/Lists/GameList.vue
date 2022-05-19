<!-- TODO: actually sort array when adding a game, list array should be unique source of truth -->
<!-- TODO: ^^ that would fix issues when jumping to next game on a sorted list -->
<template lang="html">
  <div
    :class="[
      'list rounded pr-3',
      viewClass,
      {
        dragging,
        'unique': singleList,
      }
      ]"
    :id="listIndex"
  >
    <b-card no-body>
      <header class="p-1 pl-2 d-flex justify-content-between align-items-center">
        <h6 class="p-0 m-0">
          <span v-b-modal="`rename-list-${listIndex}`">
            <b-badge>{{ list.games.length }}</b-badge>
            {{ list.name }}
          </span>

          <small v-if="showGameCount" class="text-muted">
              {{ list.games.length }} {{ $t('global.games') }}
          </small>

          <small v-if="autoSortEnabled" class="text-muted" v-b-modal="`sort-list-${listIndex}`">
            <!-- {{ `${$t('board.list.sortedBy')} ${$t(`board.list.${list.settings.sortOrder}`)}` }} -->
          </small>
        </h6>

        <b-button
          v-if="user && user.uid === board.owner"
          variant="transparent"
          :disabled="preview"
          :to="{ name: 'board.list.edit', params: { id: board.id, listIndex } }"
        >
          <i class="fa fa-pencil-alt fa-fw" />
        </b-button>

        <!-- TODO: consolidate public/private actions -->
        <b-button
          v-else
          disabled
          size="sm"
          variant="secondary"
          class="m-1"
        >
          <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
        </b-button>
      </header>

      <draggable
        class="games"
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
          :id="gameId"
          :is="gameCardComponent"
          :key="gameId"
          :list="list"
          :game-id="gameId"
          :class="{ 'mb-2': view !== 'covers'}"
          v-b-toggle.game-sidebar
          @click.native="openGame(gameId, list)"
        />

        <b-button
          block
          v-if="isEmpty"
          class="mb-2"
          variant="light"
          v-b-modal="`game-modal-${list.name}`"
        >
          {{ $t('board.list.emptyListButton') }}
        </b-button>
      </draggable>
    </b-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardCovers from '@/components/GameCards/GameCardCovers';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';
import orderby from 'lodash.orderby';
import { DEFAULT_LIST_VIEW } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
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
    ...mapGetters(['isBoardOwner']),

    draggingDisabled() {
      return !this.user || !this.isBoardOwner || this.autoSortEnabled;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.list?.settings?.sortOrder);
    },

    sortedGames() {
      const { settings, games } = this.list;
      const sortOrder = settings.sortOrder || 'sortByCustom';

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

    viewClass() {
      const { settings } = this.list;

      return settings.view || DEFAULT_LIST_VIEW;
    },
  },

  methods: {
    openGame(id, list) {
      this.$router.push({
        name: 'game',
        params: {
          id,
          slug: this.games[id].slug,
        },
      });
    },

    validateMove({ from, to }) {
      const isDifferentList = from.id !== to.id;
      const isDuplicate = this.board.lists[to.id].games.includes(Number(this.draggingId));

      if (isDuplicate && isDifferentList) {
        return false;
      }

      return true;
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

      this.$bvToast.toast('List saved');
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
