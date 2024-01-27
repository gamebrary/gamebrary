<template lang="html">
  <div class="d-flex w-100 align-items-center mb-2 tier-list">
    <b-dropdown
      v-if="user && isBoardOwner"
      size="lg"
      variant="link"
      toggle-class="text-decoration-none p-0"
      no-caret
      dropright
    >
      <template #button-content>
        <b-avatar
          variant="primary"
          :text="tierLetter"
          :title="list.name"
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

      <b-dropdown-item @click="editList">
        Edit list
      </b-dropdown-item>
    </b-dropdown>

    <b-avatar
      v-else
      variant="primary"
      :text="tierLetter"
      :title="list.name"
      rounded
      :style="`background-color: ${list.backgroundColor}`"
      class="p-0"
      size="100"
    />

    <draggable
      handle=".game"
      ghost-class="card-placeholder"
      drag-class="border-success"
      chosen-class="border-primary"
      class="tier-game w-100 d-flex"
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
        :src="$options.getImageUrl(cachedGames[gameId], $options.IMAGE_SIZE_COVER_SMALL)"
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
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  getImageUrl,
  IMAGE_SIZE_COVER_SMALL,

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
  },

  data() {
    return {
      draggingId: null,
      editing: false,
    };
  },

  computed: {
    ...mapState(['cachedGames', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner']),

    tierLetter() {
      return this.list.name?.charAt(0);
    },

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
        await this.$store.dispatch('LOAD_IGDB_GAMES', [gameId]);
        this.$bvToast.toast('Game added');
      } catch (e) {
        this.$bvToast.toast('There was an error adding game', { variant: 'danger' });
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
      }
    },

    openGame(id) {
      const slug = slugify(this.cachedGames?.[id]?.slug, { lower: true });

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
      try {
        await this.$store.dispatch('SAVE_BOARD');
        this.$bus.$emit('ALERT', { type: 'success', message: 'Board updated' });
      } catch (e) {
        this.$store.commit('SET_SESSION_EXPIRED', true);
      }
    },

    editList() {
      this.$bus.$emit('EDIT_LIST', this.listIndex);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tier-game {
  height: 100px;
  overflow-y: hidden;
  overflow-x: auto;
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
