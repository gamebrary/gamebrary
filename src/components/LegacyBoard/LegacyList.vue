<template lang="html">
  <div :class="['list mr-3', viewClass, { unique, dragging }]">
    <b-card no-body>
      <b-card-header
        class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center"
      >
        <h6 class="m-0">
          <b-badge v-if="autoSortEnabled">
            <b-icon-sort-up />
          </b-badge>

          <b-badge v-if="list[listIndex].showGameCount">
              {{ gameList.length }}
          </b-badge>

          {{ list[listIndex].name }}
        </h6>

        <b-button-group>
          <add-game-modal :list-id="listIndex" />
          <list-settings :list-index="listIndex" />
        </b-button-group>
      </b-card-header>

      <draggable
        class="games"
        :list="gameList"
        :id="listIndex"
        :move="validateMove"
        v-bind="gameDraggableOptions"
        @end="dragEnd"
        @start="dragStart"
      >
        <component
          v-for="game in sortedGames"
          :is="gameCardComponent"
          :key="game"
          :id="game"
          :game-id="game"
          :list-id="listIndex"
        />

        <b-button
          variant="light"
          block
          v-if="isEmpty"
          class="mb-2"
          v-b-modal="`game-modal-${listIndex}`"
        >
          Click here or drag games here
        </b-button>
      </draggable>
    </b-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListSettings from '@/components/LegacyBoard/LegacyListSettings';
import GameCardDefault from '@/components/LegacyBoard/LegacyGameCardDefault';
import GameCardGrid from '@/components/LegacyBoard/LegacyGameCardGrid';
import GameCardCompact from '@/components/LegacyBoard/LegacyGameCardCompact';
import GameCardText from '@/components/LegacyBoard/LegacyGameCardText';
import AddGameModal from '@/components/LegacyBoard/LegacyAddGameModal';
import orderby from 'lodash.orderby';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardDefault,
    GameCardGrid,
    GameCardCompact,
    GameCardText,
    AddGameModal,
    ListSettings,
    draggable,
  },

  props: {
    name: {
      type: String,
      default: '',
    },
    gameList: {
      type: Array,
      default: () => [],
    },
    listIndex: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      gameDraggableOptions: {
        handle: '.game-card',
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
    ...mapState(['user', 'gameLists', 'platform', 'settings', 'games', 'dragging', 'progresses']),

    autoSortEnabled() {
      const list = this.list[this.listIndex];

      return list && list.sortOrder && list.sortOrder !== 'sortByCustom';
    },

    sortedGames() {
      const sortOrder = this.list[this.listIndex].sortOrder || 'sortByCustom';
      const { gameList } = this;

      // TODO: use lodash to clean things up a bit here

      switch (sortOrder) {
      case 'sortByCustom':
        return gameList;
      case 'sortByProgress':
        return orderby(gameList, [(game) => {
          const progress = this.games[game]
                        && this.progresses[this.platform.code][this.games[game].id]
            ? Number(this.progresses[this.platform.code][this.games[game].id])
            : 0;

          return progress;
        }], ['desc']);
      case 'sortByRating':
        return orderby(gameList, [(game) => {
          const rating = this.games[game] && this.games[game].rating
            ? this.games[game].rating
            : 0;

          return rating;
        }], ['desc']);
      case 'sortByName':
        return orderby(gameList, [(game) => {
          const name = this.games[game] && this.games[game].name
            ? this.games[game].name.toUpperCase()
            : '';

          return name;
        }]);
      case 'sortByReleaseDate':
        return orderby(gameList, [(game) => {
          const releaseDate = this.games[game] && this.games[game].release_dates
            ? this.games[game].release_dates
              .find(({ platform }) => this.platform.id === platform)
            : '';

          return releaseDate && releaseDate.date;
        }]);
      default:
        return gameList;
      }
    },

    list() {
      return this.gameLists[this.platform.code];
    },

    isEmpty() {
      return this.gameList.length === 0;
    },

    view() {
      return this.list[this.listIndex].view;
    },

    unique() {
      return this.list.length === 1;
    },

    showGameCount() {
      return this.settings[this.platform.code] && this.settings[this.platform.code].showGameCount;
    },

    gameCardComponent() {
      return this.view && Object.keys(this.gameCardComponents).includes(this.view)
        ? this.gameCardComponents[this.view]
        : 'GameCardDefault';
    },

    viewClass() {
      return this.list[this.listIndex].view || 'single';
    },

    showGameRatings() {
      return this.list[this.listIndex].showGameRatings || false;
    },

    hideReleaseDates() {
      return this.list[this.listIndex].hideReleaseDates || false;
    },
  },

  methods: {
    validateMove({ from, to }) {
      const isDifferentList = from.id !== to.id;
      const isDuplicate = this.list[to.id].games.includes(Number(this.draggingId));
      const validMove = isDifferentList && isDuplicate;
      return !validMove;
    },

    dragStart({ item }) {
      this.$store.commit('SET_DRAGGING_STATUS', true);
      this.draggingId = item.id;

      this.$nextTick(() => {
        if (window.innerWidth <= 780) {
          window.navigator.vibrate([100]);
        }
      });
    },

    dragEnd() {
      this.$store.commit('SET_DRAGGING_STATUS', false);
      this.$emit('dragEnd');
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

    &.unique {
      @media(max-width: 780px) {
        min-width: 300px;
        width: calc(100vw - 80px);
      }
    }

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
        padding: .5rem;
        grid-template-columns: 1fr 1fr;
        grid-gap: .5rem;

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

      &.unique {
        .games {
          grid-template-columns: 1fr 1fr 1fr;

          // @media($tiny) {
          //   grid-template-columns: 1fr 1fr;
          // }

          @media(min-width: 781px) {
            grid-template-columns: 1fr 1fr;
          }
        }
      }
    }
  }

  .list-settings {
    padding: 1rem;
  }
</style>
