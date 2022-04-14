<!-- TODO: add actions, e.g. clone board, clone list, add to favorites, like board, etc... -->

<template lang="html">
  <div
    :class="['board p-3 pr-5', { dragging, empty }]"
    :style="boardStyles"
  >
    <boards-dropdown />

    <portal v-if="isBoardPage" to="headerActions">
      <b-button
        v-if="user && user.uid && user.uid === board.owner"
        variant="primary"
        class="mr-2"
        :to="{ name: 'edit-board', params: { id: board.id } }"
      >
        Edit board
      </b-button>

      <!-- <b-button
        variant="warning"
        class="mr-2"
      >
        <i class="fas fa-filter fa-fw" aria-hidden />
        Filter
      </b-button> -->
    </portal>

    <board-placeholder v-if="loading" />

    <template v-else-if="showBoard">
      <!-- TODO: put board in component -->
      <game-list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />

      <empty-board v-if="empty" />

      <div
        v-else-if="user && user.uid && user.uid === board.owner"
        class="d-flex flex-column"
      >
        <b-button
          variant="light"
          v-b-modal:add-list
        >
          <i class="fas fa-plus fa-fw" aria-hidden />
        </b-button>
      </div>

      <add-list-modal />
    </template>

    <b-alert
      v-else
      variant="warning"
      show
    >
      <span>Private Board</span>
    </b-alert>
  </div>
</template>

<script>
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import BoardsDropdown from '@/components/BoardsDropdown';
import EmptyBoard from '@/components/Board/EmptyBoard';
import AddListModal from '@/components/Board/AddListModal';
import GameList from '@/components/Lists/GameList';
import chunk from 'lodash.chunk';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameList,
    BoardPlaceholder,
    BoardsDropdown,
    EmptyBoard,
    AddListModal,
  },

  data() {
    return {
      loading: true,
      queryLimit: 500,
      backgroundUrl: null,
    };
  },

  computed: {
    ...mapState(['user', 'dragging', 'board', 'wallpapers']),
    ...mapGetters(['isBoardOwner']),

    isBoardPage() {
      return this.$route.name === 'board';
    },

    isPublicRoute() {
      return this.$route.meta?.public;
    },

    showBoard() {
      const { isPublicRoute, board } = this;
      const isPublicBoard = isPublicRoute && board.isPublic;

      return this.user || isPublicBoard;
    },

    boardStyles() {
      const backgroundImage = this.backgroundUrl
        ? `background-image: url('${this.backgroundUrl}');`
        : null;

      const backgroundColor = this.board?.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;

      return [backgroundImage, backgroundColor].join('');
    },

    boardId() {
      return this.$route.params?.id;
    },

    empty() {
      return this.board?.lists?.length === 0;
    },
  },

  watch: {
    boardId(boardId) {
      if (boardId) this.load();
    },
  },

  async mounted() {
    this.$store.commit('CLEAR_BOARD');

    if (this.isPublicRoute) {
      await this.loadPublicBoard(this.boardId);

      if (this.showBoard) {
        this.loadBoardGames();
        this.loadBoardBackground();
      }
    } else {
      this.load();
    }

    this.$bus.$on('LOAD_BOARD_BACKGROUND', this.loadBoardBackground);
  },

  destroyed() {
    this.$bus.$off('LOAD_BOARD_BACKGROUND');
  },

  methods: {
    load() {
      this.backgroundUrl = null;

      if (this.boardId && this.user) {
        this.loadBoard(this.boardId);
      } else {
        this.$router.push({ name: 'boards' });
      }
    },

    async loadBoard(id) {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD', id)
        .catch(() => {
          this.$router.replace({ path: '/' });
        });

      this.loadBoardGames();
      this.loadBoardBackground();
    },

    async loadPublicBoard(id) {
      this.loading = true;

      await this.$store.dispatch('LOAD_PUBIC_BOARD', id)
        .catch(() => {
          // this.$router.replace({ path: '/' });
        });

      this.loadBoardGames();
      this.loadBoardBackground();
    },

    async loadBoardBackground() {
      const url = this.board?.backgroundUrl;

      if (url) {
        this.backgroundUrl = url.includes('igdb')
          ? url
          : await this.$store.dispatch('LOAD_WALLPAPER', url);
      } else {
        this.backgroundUrl = null;
      }
    },

    loadBoardGames() {
      const { lists } = this.board;

      if (lists && lists.length === 0) {
        this.$bvModal.show('add-list');
      }

      const boardGames = lists.length
        ? Array.from(new Set(lists.map(({ games }) => games).flat()))
        : [];

      if (boardGames.length === 0) {
        this.loading = false;

        return boardGames;
      }

      return boardGames.length > this.queryLimit
        ? this.loadGamesInChunks(boardGames)
        : this.loadGames(boardGames);
    },

    async loadGames(gameList) {
      this.loading = true;

      await this.$store.dispatch('LOAD_GAMES', gameList.toString())
        .catch(() => {
          this.$bvToast.toast('Error loading games', { variant: 'error' });
        });

      this.loading = false;
    },

    loadGamesInChunks(gameList) {
      const chunkedGameList = chunk(gameList, this.queryLimit);

      chunkedGameList.forEach((gameListChunk) => {
        this.loadGames(gameListChunk);
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.board {
  user-select: none;
  display: flex;
  background-size: cover;
  align-items: flex-start;
  height: 100%;
  width: calc(100vw - 66px);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
