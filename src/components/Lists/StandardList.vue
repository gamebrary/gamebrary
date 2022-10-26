<template lang="html">
  <draggable
    class="mx-2 mx-sm-auto standard-list"
    handle=".card"
    ghost-class="card-placeholder"
    drag-class="border-selected"
    chosen-class="border-primary"
    filter=".drag-filter"
    delay="50"
    animation="500"
    :list="list.games"
    :move="validateMove"
    :disabled="draggingDisabled"
    :group="{ name: 'games' }"
    @end="dragEnd"
    @start="dragStart"
  >
    <b-card
      no-body
      class="mb-2 flex-row align-items-center cursor-pointer"
      v-for="(game, index) in listGames"
      :key="game.id"
      @click="openGame(game.id, list)"
    >
      <b-img
        :src="$options.getThumbnailUrl(game)"
        :alt="game.name"
        class="m-2 game-cover"
        rounded
        fluid
      />

      <h3 class="d-flex mr-2 w-100 px-3">
        <b-badge
          v-if="board.ranked"
          variant="light"
          class="mr-1"
        >
          {{ index + 1 }}
        </b-badge>
        {{ game.name }}
      </h3>

    </b-card>

    <div v-if="isEmpty && isBoardOwner">
      <b-button
        variant="light"
        block
        class="mb-2"
        :disabled="!isBoardOwner"
        :to="{ name: 'search', query: { boardId: board.id, listIndex: 0 } }"
      >
        <template v-if="isBoardOwner">Add games</template>
        <template v-else>Empty list</template>
      </b-button>
    </div>

    <game-selector
      :filter="filter"
      @select-game="selectGame"
    />
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import GameSelector from '@/components/GameSelector';
import { DEFAULT_LIST_VIEW } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import { getThumbnailUrl } from '@/utils';

export default {
  getThumbnailUrl,

  components: {
    draggable,
    GameSelector,
  },

  props: {
    list: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      draggingId: null,
      editing: false,
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner']),

    filter() {
      return this.list?.games || [];
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.list?.settings?.sortOrder);
    },

    listGames() {
      return this.list.games.map((id) => this.games?.[id]);
    },

    isEmpty() {
      return this.list.games.length === 0;
    },

    singleList() {
      return this.board.lists.length === 1;
    },
  },

  methods: {
    selectGame(gameId) {
      if (this.list.games.includes(gameId)) {
        console.log('remove');
      } else {
        this.addGame(gameId);
        // this.list.games.push(gameId);
        // this.saveBoard();
        // console.log('add');
        // console.log('select gameId', gameId);
        // console.log(this.list);
      }
    },

    async addGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board?.lists?.[0]?.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board.id);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
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


<style lang="scss" rel="stylesheet/scss">
.game-cover {
  width: 120px;
}
.standard-list {
  background: #ccf;
  width: 500px;

  @media(max-width: 480px) {
    width: 100%;
  }
}
</style>
