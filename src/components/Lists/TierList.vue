<template lang="html">
  <div class="d-flex align-items-center mb-2">
    <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none p-0 pl-3" no-caret>
      <template #button-content>
        <b-avatar
          variant="primary"
          :text="list.name"
          rounded
          :style="`background-color: ${list.backgroundColor}`"
          size="100"
        />
      </template>

      <game-selector
        title="Add games"
        :filter="allGames"
        trigger-text="Add games"
        trigger-component="b-dropdown-item"
        @select-game="selectGame"
      />

      <b-dropdown-item :to="{ name: 'board.edit', params: { id: board.id } }">
        Edit list
      </b-dropdown-item>
    </b-dropdown>



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
        :src="$options.getImageUrl(games[gameId].cover.image_id, 't_cover_med_2x')"
        @click="openGame(gameId)"
      />
    </draggable>
  </div>
</template>

<script>
import { getImageUrl } from '@/utils';
import draggable from 'vuedraggable';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import { mapState, mapGetters } from 'vuex';
import gameCardMixin from '@/mixins/gameCardMixin';
import GameSelector from '@/components/GameSelector';

export default {
  getImageUrl,

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
