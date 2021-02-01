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
    <b-card
      no-body
      :bg-variant="nightMode ? 'dark' : null"
      :text-variant="nightMode ? 'white' : null"
    >
      <b-card-header
        class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center"
        :header-bg-variant="showDuplicateWarning ? 'warning' : null"
      >
        <p class="list-name p-0 m-0">
          <span v-b-modal="`rename-list-${listIndex}`">
            {{ showDuplicateWarning ? 'Game already in list' : list.name }}
          </span>

          <br />

          <small v-if="showGameCount">
              {{ list.games.length }} {{ $t('global.games') }}
          </small>

          <small v-if="autoSortEnabled" class="text-muted" v-b-modal="`sort-list-${listIndex}`">
            {{ `${$t('board.list.sortedBy')} ${$t(`board.list.${list.settings.sortOrder}`)}` }}
          </small>
        </p>

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
          class="mb-2"
          @click.native="openGame(game, list)"
        />

        <b-button
          :variant="nightMode ? 'dark' : 'light'"
          block
          v-if="isEmpty"
          class="mb-2"
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
        covers: 'GameCardCovers',
        grid: 'GameCardGrid',
        compact: 'GameCardCompact',
        text: 'GameCardText',
      },
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'duplicatedGame']),
    ...mapGetters(['nightMode']),

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

  &.unique {
    @media(max-width: 480px) {
      width: calc(100vw - 144px);
    }
  }

  .games {
    height: 100%;
    overflow: hidden;
    max-height: calc(100vh - 100px);
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
