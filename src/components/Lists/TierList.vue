<template lang="html">
  <div class="d-flex align-items-center mb-2">
    <game-selector
      title="Add games"
      class="mr-3 "
      :filter="allGames"
      @select-game="selectGame"
    >
      <i class="fa fa-plus" aria-hidden="true" />
    </game-selector>

    <b-avatar
      variant="primary"
      :text="list.name"
      :to="{ name: 'board.edit', params: { id: board.id } }"
      rounded
      :style="`background-color: ${list.backgroundColor}`"
      size="100"
    />

    <draggable
      handle=".game"
      ghost-class="card-placeholder"
      drag-class="border-selected"
      chosen-class="border-primary"
      class="tier-list d-flex"
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
      <b-img
        v-for="gameId in list.games"
        :key="gameId"
        class="game cursor-pointer rounded ml-2"
        fluid
        :src="$options.getThumbnailUrl(games[gameId])"
        @click="openGame(gameId)"
      />
    </draggable>
  </div>
</template>

<script>
import { getThumbnailUrl } from '@/utils';
import draggable from 'vuedraggable';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import { mapState, mapGetters } from 'vuex';
import gameCardMixin from '@/mixins/gameCardMixin';
import GameSelector from '@/components/GameSelector';

export default {
  getThumbnailUrl,

  mixins: [gameCardMixin],

  components: {
    GameSelector,
    draggable,
  },

  props: {
    allGames: Array,
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
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner']),

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    isEmpty() {
      return this.list.games.length === 0;
    },
  },

  methods: {
    selectGame(gameId) {
      return this.list.games.includes(gameId)
        ? this.removeGame(gameId)
        : this.addGame(gameId);
    },

    async addGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board?.lists?.[this.listIndex]?.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board.id);
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
        await this.$store.dispatch('LOAD_BOARD', board.id)
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
       cursor-pointer}
    },

    openGame(id) {
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

<style lang="scss" rel="stylesheet/scss" scoped>
.tier-list {
  width: calc(100vw - 180px);
  height: 100px;
  overflow-y: hidden;
  overflow-x: auto;
  margin-bottom: 1px;
}

.game {
  height: 100px;
  width: auto;
}
</style>

<style lang="scss" rel="stylesheet/scss">
.card-placeholder {
  background: #c00;
}
</style>
