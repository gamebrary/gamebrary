<template lang="html">
  <div
    :class="['list mr-3', viewClass, { dragging }]"
    :id="listIndex"
  >
    <b-card no-body>
      <b-card-header
        class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center"
        :header-bg-variant="showDuplicateWarning ? 'warning' : null"
      >
        <h6 class="m-0" v-b-modal="`rename-list-${listIndex}`">
          <b-badge v-if="autoSortEnabled">
            <b-icon-sort-up />
          </b-badge>

          <b-badge v-if="showGameCount">
              {{ list.games.length }}
          </b-badge>

          {{ showDuplicateWarning ? 'Game already in list' : list.name }}
        </h6>

        <list-settings :list="list" :list-index="listIndex" />
      </b-card-header>

      <draggable
        class="games"
        :list="list.games"
        :id="listIndex"
        :move="validateMove"
        v-bind="gameDraggableOptions"
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
        />

        <b-button
          variant="light"
          block
          v-if="isEmpty"
          class="mb-2"
          v-b-modal="`game-modal-${list.name}`"
        >
          Click here or drag games here
        </b-button>
      </draggable>
    </b-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListSettings from '@/components/Lists/ListSettings';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';
import orderby from 'lodash.orderby';
import { DEFAULT_LIST_VIEW } from '@/constants';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardDefault,
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
      gameDraggableOptions: {
        handle: '.card',
        ghostClass: 'card-placeholder',
        filter: '.drag-filter',
        delay: 100,
        delayOnTouchOnly: true,
        animation: 500,
        group: {
          name: 'games',
        },
      },
      gameCardComponents: {
        single: 'GameCardDefault',
        grid: 'GameCardGrid',
        compact: 'GameCardCompact',
        text: 'GameCardText',
      },
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'duplicatedGame']),

    autoSortEnabled() {
      const { settings } = this.list;

      if (!settings) {
        return false;
      }

      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(settings.sortOrder);
    },

    showDuplicateWarning() {
      return this.duplicatedGame
        && this.duplicatedGame.originListId !== this.listIndex
        && this.duplicatedGame.listId === this.listIndex
        && this.list.games.includes(this.duplicatedGame.gameId);
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
    validateMove({ from, to }) {
      const isDifferentList = from.id !== to.id;
      const isDuplicate = this.board.lists[to.id].games.includes(Number(this.draggingId));

      if (isDuplicate) {
        this.$store.commit('SET_DUPLICATED_GAME', {
          gameId: Number(this.draggingId),
          listId: Number(to.id),
          originListId: Number(from.id) },
        );
      }

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
      this.$store.commit('SET_DUPLICATED_GAME', null);
      this.saveBoard();
    },

    async saveBoard() {
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
        });

      this.$bvToast.toast('List saved', {
        title: 'Success',
        variant: 'success',
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
    width: 300px;
    border-radius: 3px;

    .games {
      display: grid;
      height: 100%;
      overflow: hidden;
      max-height: calc(100vh - 144px);
      overflow-y: auto;
      padding: .5rem .5rem 0;
      width: 100%;
    }

    &.grid {
      .games {
        padding: .5rem .5rem 0;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: .5rem;

        // https://github.com/w3c/csswg-drafts/issues/129
        &::after {
          content: '';
          display: block;
          height: 1px;
          margin-top: -1px;
          width: 100%;
          grid-column: span 2;
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
</style>
