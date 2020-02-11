<template lang="html">
  <div :class="['list', viewClass, { unique: unique && view !== 'masonry', dragging }]">
    <header>
      <span class="list-name">
        <sort-icon
          v-if="autoSortEnabled"
          :sort-order="list[listIndex].sortOrder"
          title="List sorted automatically"
        />

        {{ list[listIndex].name }}
        <span
          v-if="showGameCount"
        >
          ({{ gameList.length }})
        </span>
      </span>

      <list-settings-modal :list-index="listIndex" />
    </header>

    <draggable
      v-if="view === 'masonry'"
      :class="`game-masonry game-masonry-${listIndex}`"
      :list="gameList"
      :id="listIndex"
      :move="validateMove"
      v-bind="gameDraggableOptions"
      @end="dragEnd"
      @start="dragStart"
    >
      <component
        v-for="game in gameList"
        :is="gameCardComponent"
        :key="`masonry-${game}`"
        :id="game"
        :game-id="game"
        :list-id="listIndex"
      />
    </draggable>

    <draggable
      v-else
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
        :key="`masonry-${game}`"
        :id="game"
        :game-id="game"
        :list-id="listIndex"
      />
    </draggable>

    <div v-if="isEmpty" class="empty-list">
      <i class="fas fa-hand-pointer fa-2x hand-drag" />
      <p><i class="fas fa-grip-vertical" /> Drag games here</p>
    </div>

    <add-game-modal :list-id="listIndex" />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Masonry from 'masonry-layout';
import ListSettingsModal from '@/components/Lists/ListSettingsModal';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardMasonry from '@/components/GameCards/GameCardMasonry';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';
import AddGameModal from '@/components/Lists/AddGameModal';
import SortIcon from '@/components/SortIcon';
import { orderBy } from 'lodash';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardDefault,
    GameCardMasonry,
    GameCardGrid,
    GameCardCompact,
    GameCardText,
    AddGameModal,
    SortIcon,
    ListSettingsModal,
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
      masonry: null,
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
        masonry: 'GameCardMasonry',
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
        return orderBy(gameList, [(game) => {
          const progress = this.games[game]
                        && this.progresses[this.platform.code][this.games[game].id]
            ? Number(this.progresses[this.platform.code][this.games[game].id])
            : 0;

          return progress;
        }], ['desc']);
      case 'sortByRating':
        return orderBy(gameList, [(game) => {
          const rating = this.games[game] && this.games[game].rating
            ? this.games[game].rating
            : 0;

          return rating;
        }], ['desc']);
      case 'sortByName':
        return orderBy(gameList, [(game) => {
          const name = this.games[game] && this.games[game].name
            ? this.games[game].name.toUpperCase()
            : '';

          return name;
        }]);
      case 'sortByReleaseDate':
        return orderBy(gameList, [(game) => {
          const date = this.games[game] && this.games[game].release_dates
            ? this.games[game].release_dates
              .filter(({ platform }) => this.platform.id === platform)[0].date
            : '';

          return date;
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

    hideGameRatings() {
      return this.list[this.listIndex].hideGameRatings || false;
    },

    hideGameInfo() {
      return this.list[this.listIndex].hideGameInfo || false;
    },

    hideGameInfoOnCover() {
      return this.list[this.listIndex].hideGameInfoOnCover || false;
    },
  },

  watch: {
    view() {
      this.initMasonry();

      setTimeout(() => {
        this.initMasonry();
      }, 500);
    },

    gameList() {
      this.initMasonry();

      setTimeout(() => {
        this.initMasonry();
      }, 500);
    },
  },

  mounted() {
    this.initMasonry();

    setTimeout(() => {
      this.initMasonry();
    }, 500);
  },

  methods: {
    initMasonry() {
      if (this.view === 'masonry') {
        this.$nextTick(() => {
          // eslint-disable-next-line
            this.masonry = new Masonry(`.game-masonry-${this.listIndex}`, {
            itemSelector: '.game-card',
            gutter: 4,
            percentPosition: true,
          });
        });
      }
    },

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
  @import "~styles/styles";

  .list {
    flex-shrink: 0;
    cursor: default;
    position: relative;
    width: 300px;
    background: var(--list-background);
    border-radius: var(--border-radius);
    margin-right: $gp;
    max-height: calc(100vh - 100px);

    @media($small) {
      max-height: calc(100vh - 80px);
      min-height: calc(100vh - 80px);

      &:not(.dragging) {
        .games {
          scroll-snap-type: x mandatory;
          scroll-padding: $gp / 2;

          .game-card {
            scroll-snap-align: start;
          }
        }
      }
    }

    &.unique {
      @media($small) {
        min-width: 300px;
        width: calc(100vw - 80px);
      }
    }

    header {
      align-items: center;
      background: var(--list-header-background);
      color: var(--list-header-text-color);
      display: flex;
      height: $list-header-height;
      justify-content: space-between;
      padding-left: $gp / 2;
      position: absolute;
      border-radius: var(--border-radius);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      width: 100%;
    }

    .list-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .games {
      display: grid;
      height: 100%;
      overflow: hidden;
      max-height: calc(100vh - 150px);
      min-height: 120px;
      overflow-y: auto;
      margin-top: $list-header-height;
      padding: $gp / 2 $gp / 2 0;
      width: 100%;
    }

    &.grid {
      .games {
        padding: $gp / 2;
        grid-template-columns: 1fr 1fr;
        grid-gap: $gp / 2;

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

          @media($tiny) {
            grid-template-columns: 1fr 1fr;
          }

          @media($desktop) {
            grid-template-columns: 1fr 1fr;
          }
        }
      }
    }
  }

  .list-settings {
    padding: $gp;
  }

  .game-masonry {
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    max-height: calc(100vh - 154px);
    min-height: 80px;
    overflow-y: auto;
    margin-top: $list-header-height;
    padding: 4px;
    width: 100%;
  }

  .empty-list {
    color: var(--progress-secondary-color);
    opacity: 0.8;
    position: absolute;
    top: 0;
    margin-top: 62px;
    height: 60px;
    width: 130px;
    left: 95px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .fa-grip-vertical {
    opacity: 0.5;
    margin-right: $gp / 2;
  }

  .hand-drag {
    position: absolute;
    left: 0;
    top: 22px;
  }
</style>
