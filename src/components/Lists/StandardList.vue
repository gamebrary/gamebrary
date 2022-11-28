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
    <h3 v-if="hasMultipleLists && list">{{ list.name }}</h3>

    <game-card-standard
      v-for="(game, index) in listGames"
      :key="index"
      :list="list"
      :game-id="game.id"
      :ranked="board.ranked"
      :rank="index + 1"
      class="mb-2"
      @click.native="openGame(game.id, list)"
    />

    <!-- <b-card
      no-body
      :bg-variant="darkTheme ? 'info' : 'white'"
      :text-variant="darkTheme ? 'white' : 'dark'"
      class=" flex-row align-items-center cursor-pointer"
      v-for="(game, index) in listGames"
      :key="index"
      @click="openGame(game.id, list)"
    >
      <b-img
        v-if="game"
        :src="$options.getThumbnailUrl(game)"
        :alt="game.name"
        class="m-2 game-cover"
        rounded
        fluid
        />

      <h3 class="d-flex mr-2 w-100 px-3 align-items-center">
        <b-avatar
          v-if="board.ranked"
          variant="light"
          class="mr-2"
          >
          {{ index + 1 }}
        </b-avatar>

        {{ game.name }}
      </h3>
    </b-card> -->

    <game-selector
      :filter="filter"
      title="Add games"
      trigger-text="Add games"
      block
      size="lg"
      @select-game="selectGame"
    />
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import GameSelector from '@/components/GameSelector';
import { mapState, mapGetters } from 'vuex';
import { getThumbnailUrl } from '@/utils';
import GameCardStandard from '@/components/GameCards/GameCardStandard';


export default {
  getThumbnailUrl,

  components: {
    draggable,
    GameCardStandard,
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
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    hasMultipleLists() {
      return this.board?.lists?.length > 1;
    },

    filter() {
      return this.list?.games || [];
    },

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.list?.sortOrder);
    },

    listGames() {
      return this.list?.games?.map((id) => this.games?.[id]) || []
        .filter(({ id }) => Boolean(id));
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
        // console.log('remove');
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
        await this.$store.dispatch('LOAD_BOARD', board?.id);
        await this.$store.dispatch('LOAD_GAMES', [gameId]);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
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
        await this.$store.dispatch('LOAD_BOARD', board?.id)
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

    openGame(id, list) {
      const slug = slugify(this.games[id].slug, { lower: true });

      this.$router.push({
        name: 'game',
        params: {
          id,
          slug,
          boardId: this.board?.id,
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
  width: 500px;

  @media(max-width: 500px) {
    width: 100%;
  }
}
</style>
