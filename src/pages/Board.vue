<template lang="html">
  <div
    :class="[
      'board px-2',
      boardClasses,
      { dragging, empty },
    ]"
    :style="boardStyles"
  >
    <board-placeholder v-if="loading" />

    <template v-else-if="showBoard">
      <list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />

      <portal to="dock">
        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          v-b-modal:edit-board
        >
          <i class="fas fa-pencil-alt fa-fw" aria-hidden />
          Edit board
        </b-button>

        <b-button
          variant="warning"
        >
          <i class="fas fa-filter fa-fw" aria-hidden />
          Filter
        </b-button>
      </portal>

      <div
        v-if="user && user.uid && user.uid === board.owner"
        class="d-flex flex-column pr-2"
      >
        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          class="mb-2"
          v-b-modal:add-list
        >
          <i class="fas fa-plus fa-fw" aria-hidden />
        </b-button>
      </div>

      <empty-board v-if="empty" class="mr-3" />

      <add-list-modal />
      <edit-board-modal />
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
import EditBoardModal from '@/components/Board/EditBoardModal';
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import EmptyBoard from '@/components/Board/EmptyBoard';
import AddListModal from '@/components/Board/AddListModal';
import List from '@/components/Lists/List';
import chunk from 'lodash.chunk';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    List,
    BoardPlaceholder,
    EmptyBoard,
    AddListModal,
    EditBoardModal,
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
    ...mapGetters(['darkTheme']),

    isPublicRoute() {
      // OPTIMIZE: use optional chaining
      return this.$route.meta && this.$route.meta.public;
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

      const backgroundColor = this.board && this.board.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;

      return [backgroundImage, backgroundColor].join('');
    },

    boardClasses() {
      const defaultBackgroundClass = this.darkTheme ? 'bg-dark' : '';

      return !this.board.backgroundColor
        ? defaultBackgroundClass
        : null;
    },

    boardId() {
      return this.$route.params.id;
    },

    empty() {
      // OPTIMIZE: use optional chaining
      return this.board && this.board.lists && this.board.lists.length === 0;
    },
  },

  watch: {
    boardId(value) {
      if (value) {
        this.load();
      }
    },
  },

  async mounted() {
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
    this.$store.commit('CLEAR_BOARD');
    this.$bus.$off('LOAD_BOARD_BACKGROUND');
  },

  methods: {
    load() {
      if (this.boardId && this.user) {
        this.loadBoard(this.boardId);
      } else {
        this.$router.push({ name: 'dashboard' });
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
      const url = this.board && this.board.backgroundUrl;

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
  background-color: #f0f0f0;
  background-size: cover;
  align-items: flex-start;
  height: 100vh;
  padding-top: 54px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
