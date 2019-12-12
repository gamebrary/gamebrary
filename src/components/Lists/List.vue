<template lang="html">
  <div :class="['list', viewClass, { unique: unique && view !== 'grid' }]">
    <header>
      <span class="list-name">
        <i
          v-if="autoSortEnabled"
          class="fas fa-magic"
          title="List sorted automatically"
        />
        {{ list[listIndex].name }}
        <span
          v-if="this.settings[this.platform.code].theme != 'touch'"
        >
          ({{ gameList.length }})
        </span>
      </span>

      <div
        v-if="this.settings[this.platform.code].theme === 'touch'"
        class="list-actions"
      >
        <add-game-modal
          class="add-game-button"
          :list-id="listIndex"
        />
        <list-settings-modal
          class="list-settings-button"
          :list-index="listIndex"
        />
      </div>
      <list-settings-modal
        v-else
        :list-index="listIndex"
      />
    </header>

    <div
      v-if="view === 'grid'"
      :class="`game-grid game-grid-${listIndex}`"
    >
      <component
        v-for="game in gameList"
        :is="gameCardComponent"
        :key="`grid-${game}`"
        :id="game"
        :game-id="game"
        :list-id="listIndex"
      />
    </div>

    <draggable
      v-else
      :class="['games', { 'empty': isEmpty } ]"
      :list="gameList"
      :id="listIndex"
      :move="validateMove"
      v-bind="gameDraggableOptions"
      @end="end"
      @start="start"
    >
      <component
        v-for="game in sortedGames"
        :is="gameCardComponent"
        :key="`grid-${game}`"
        :id="game"
        :game-id="game"
        :list-id="listIndex"
      />
    </draggable>

    <add-game-modal
      :list-id="listIndex"
      v-if="this.settings[this.platform.code].theme != 'touch'"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Masonry from 'masonry-layout';
import ListSettingsModal from '@/components/Lists/ListSettingsModal';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardWide from '@/components/GameCards/GameCardWide';
import GameCardText from '@/components/GameCards/GameCardText';
import AddGameModal from '@/components/Lists/AddGameModal';
import { mapState } from 'vuex';

export default {
  name: 'List',

  components: {
    GameCardDefault,
    GameCardGrid,
    GameCardWide,
    GameCardText,
    AddGameModal,
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
        handle: '.game-drag-handle',
        ghostClass: 'card-placeholder',
        animation: 500,
        group: {
          name: 'games',
        },
      },
      gameCardComponents: {
        single: 'GameCardDefault',
        grid: 'GameCardGrid',
        wide: 'GameCardWide',
        text: 'GameCardText',
      },
    };
  },

  computed: {
    ...mapState(['user', 'gameLists', 'platform', 'settings', 'games']),

    autoSortEnabled() {
      const list = this.list[this.listIndex];

      return list && list.sortOrder && list.sortOrder !== 'sortByCustom';
    },

    sortedGames() {
      const sortOrder = this.list[this.listIndex].sortOrder || 'sortByCustom';
      const { gameList } = this;

      switch (sortOrder) {
      case 'sortByCustom':
        return gameList;
      case 'sortByRating':
        return gameList.sort((a, b) => {
          const gameA = this.games[a] && this.games[a].rating
            ? this.games[a].rating
            : 0;

          const gameB = this.games[b] && this.games[b].rating
            ? this.games[b].rating
            : 0;

          if (gameA > gameB) {
            return -1;
          }

          return gameA < gameB ? 1 : 0;
        });
      case 'sortByName':
        return gameList.sort((a, b) => {
          const gameA = this.games[a] && this.games[a].name
            ? this.games[a].name.toUpperCase()
            : '';

          const gameB = this.games[b] && this.games[b].name
            ? this.games[b].name.toUpperCase()
            : '';

          if (gameA < gameB) {
            return -1;
          }

          return gameA > gameB ? 1 : 0;
        });
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

    gameCardComponent() {
      return this.view && Object.keys(this.gameCardComponents).includes(this.view)
        ? this.gameCardComponents[this.view]
        : 'GameCardDefault';
    },

    viewClass() {
      return this.list[this.listIndex].view || 'single';
    },
  },

  watch: {
    view() {
      this.initGrid();

      setTimeout(() => {
        this.initGrid();
      }, 500);
    },

    gameList() {
      this.initGrid();

      setTimeout(() => {
        this.initGrid();
      }, 500);
    },
  },

  mounted() {
    this.initGrid();

    setTimeout(() => {
      this.initGrid();
    }, 500);
  },

  methods: {
    initGrid() {
      if (this.view === 'grid') {
        this.$nextTick(() => {
          // eslint-disable-next-line
            this.masonry = new Masonry(`.game-grid-${this.listIndex}`, {
            itemSelector: '.game-card',
            gutter: 4,
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

    start({ item }) {
      this.dragging = true;
      this.draggingId = item.id;
    },

    end() {
      this.$emit('end');
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
    border-radius: $border-radius;
    overflow: hidden;
    margin-right: $gp;
    max-height: calc(100vh - 100px);

    .games {
      display: grid;
    }

    &.unique {
      @media($small) {
        width: calc(100vw - 80px);
      }
    }

    .theme-touch & {
      display: flex;
      flex-wrap: wrap;
      min-height: 100vh;
      max-height: 100vh;
      border-radius: 0;

      @media($tiny) {
        min-width: 300px;
        width: 100vw;
        margin-right: 0;
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
      border-radius: $border-radius;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      width: 100%;

      .theme-touch & {
        margin-top: 15px;
        margin-bottom: 15px;
      }
    }

    .list-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .theme-touch & {
        font-size: 24px;
        font-weight: 700;
      }
    }

    .list-actions {
      display: flex;
    }

    .list-settings-button {
      font-size: 18px;
      color: var(--accent-color);
    }

    .games {
      height: 100%;
      overflow: hidden;
      max-height: calc(100vh - 150px);
      min-height: 80px;
      overflow-y: auto;
      margin-top: $list-header-height;
      padding: $gp / 2 $gp / 2 0;
      width: 100%;

      &.empty {
        margin: ($list-header-height + $gp / 2) $gp / 2 $gp / 2;
        padding: $gp;
        width: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #a5a2a2;
      }

      .theme-touch & {
        border-radius: 0;
        margin-top: calc(#{$list-header-height} + 30px);
        max-height: calc(100vh - calc(#{$list-header-height} + 30px));

        &::after {
          content: '';
          display: block;
          height: 48px;
          width: 100%;
        }
      }
    }
  }

  .list-settings {
    padding: $gp;
  }

  .game-grid {
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

    .theme-touch & {
      border-radius: 0;
      display: inline-flex;
      margin-top: calc(#{$list-header-height} + 30px);
      max-height: calc(100vh - calc(#{$list-header-height} + 30px + 48px + 15px));
    }
  }
</style>
