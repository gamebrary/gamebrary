<!-- TODO: actually sort array when adding a game, list array should be unique source of truth -->
<!-- TODO: ^^ that would fix issues when jumping to next game on a sorted list -->
<template lang="html">
  <div
    :class="[
      'list rounded pr-2',
      viewClass,
      {
        dragging,
        'unique': singleList,
      }
      ]"
    :id="listIndex"
  >
    <b-card no-body>
      <b-card-header
        class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center"
      >
        <p class="list-name p-0 m-0">
          <span v-b-modal="`rename-list-${listIndex}`">
            {{ list.name }}
          </span>

          <br />

          <small v-if="showGameCount" class="text-muted">
              {{ list.games.length }} {{ $t('global.games') }}
          </small>

          <small v-if="autoSortEnabled" class="text-muted" v-b-modal="`sort-list-${listIndex}`">
            {{ `${$t('board.list.sortedBy')} ${$t(`board.list.${list.settings.sortOrder}`)}` }}
          </small>
        </p>

        <list-settings
          v-if="user && user.uid === board.owner"
          :list="list"
          :list-index="listIndex"
        />

        <b-button
          v-else
          size="sm"
          class="m-1"
          v-b-modal:authModal
        >
          <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
        </b-button>
      </b-card-header>

      <draggable
        class="games"
        :list="list.games"
        :id="listIndex"
        :move="validateMove"
        handle=".card"
        ghost-class="card-placeholder"
        :disabled="draggingDisabled"
        filter=".drag-filter"
        animation="300"
        :group="{ name: 'games' }"
        @end="dragEnd"
        @start="dragStart"
      >
        <component
          v-for="game in sortedGames"
          :id="game"
          :is="gameCardComponent"
          :key="game"
          :list="list"
          :game-id="game"
          class="mb-2"
          @click.native="openGame(game, list)"
        />

        <b-button
          block
          v-if="isEmpty"
          class="mb-2"
          variant="secondary"
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
import ListSettings from '@/components/Lists/ListSettings';
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
    ListSettings,
    draggable,
  },

  props: {
    list: {
      type: Object,
      default: () => {},
    },
    listIndex: Number,
    required: true,
  },

  data() {
    return {
      draggingId: null,
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
    ...mapState(['games', 'dragging', 'progresses', 'board', 'user']),
    ...mapGetters(['isBoardOwner']),

    draggingDisabled() {
      return !this.user || !this.isBoardOwner || this.autoSortEnabled;
    },

    autoSortEnabled() {
      const { settings } = this.list;

      if (!settings) {
        return false;
      }

      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(settings.sortOrder);
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
      const { settings } = this.list;

      return settings && settings.view;
    },

    showGameCount() {
      const { settings } = this.list;

      return settings && settings.showGameCount;
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
    openGame(gameId, list) {
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId, list });
      this.$bvModal.show('game-modal');
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
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: .5rem .5rem 0;
    width: 100%;
  }

  &.grid {
    .games {
      display: grid;
      padding: .5rem .5rem 0;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: .5rem;
    }
  }

  &.covers {
    .games {
      display: grid;
      padding: .5rem .5rem 0;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: .5rem;

      img {
        width: 100%;
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

  opacity: .1;
  background: #000;
}

.list-name {
  line-height: 0.9rem;
}
</style>
