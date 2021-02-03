<template lang="html">
  <div
    :class="['board py-2', boardBackground, { dragging, 'empty': isEmptyBoard }]"
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

      <empty-board v-if="isEmptyBoard" class="mr-3" />

      <add-list-modal />
      <board-settings />
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
import BoardSettings from '@/components/Settings/BoardSettings';
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import EmptyBoard from '@/components/Board/EmptyBoard';
import AddListModal from '@/components/Board/AddListModal';
import List from '@/components/Lists/List';
import chunk from 'lodash.chunk';
import { mapState, mapGetters } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    List,
    BoardPlaceholder,
    EmptyBoard,
    AddListModal,
    BoardSettings,
  },

  data() {
    return {
      loading: true,
      queryLimit: 500,
      wallpaperUrl: null,
    };
  },

  computed: {
    ...mapState(['user', 'dragging', 'board', 'wallpapers']),
    ...mapGetters(['nightMode']),

    showBoard() {
      const { isPublicRoute, board } = this;
      const isPublicBoard = isPublicRoute && board.isPublic;

      return this.user || isPublicBoard;
    },

    boardStyles() {
      if (!this.showBoard) {
        return '';
      }

      if (this.wallpaperUrl) {
        return `background-image: url('${this.wallpaperUrl}');`;
      }

      // TODO: use optional chaining
      return this.board && this.board.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;
    },

    boardId() {
      return this.$route.params.id;
    },

    isEmptyBoard() {
      // TODO: use optional chaining
      return this.board && this.board.lists && this.board.lists.length === 0;
    },

    isPublicRoute() {
      // TODO: use optional chaining
      return this.$route.meta && this.$route.meta.public;
    },

    boardBackground() {
      if (this.board.backgroundColor) {
        return null;
      }

      return this.nightMode
        ? 'bg-dark'
        : 'bg-light';
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
        this.setWallpaper();
      }
    } else {
      this.load();
    }

    this.$bus.$on('RELOAD_WALLPAPER', this.setWallpaper);
  },

  destroyed() {
    this.$store.commit('CLEAR_BOARD');
    this.$bus.$off('RELOAD_WALLPAPER');
  },

  methods: {
    load() {
      // TODO: handle loading public board
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
      this.setWallpaper();
    },

    async loadPublicBoard(id) {
      this.loading = true;

      await this.$store.dispatch('LOAD_PUBIC_BOARD', id)
        .catch(() => {
          // this.$router.replace({ path: '/' });
        });

      this.loadBoardGames();
      this.setWallpaper();
    },

    async setWallpaper() {
      const { wallpaper } = this.board;

      const wallpaperObject = wallpaper && this.wallpapers.length
        ? this.wallpapers.find(({ fullPath }) => fullPath === wallpaper)
        : null;

      this.wallpaperUrl = wallpaperObject && wallpaperObject.url
        ? wallpaperObject.url
        : null;
    },

    loadBoardGames() {
      const { lists } = this.board;

      if (lists && lists.length === 0) {
        this.$bvModal.show('add-list');
      }

      const boardGames = Array.from(new Set(lists.map(({ games }) => games).flat()));

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
  height: 100vh;
  width: 100%;
  padding-left: calc(58px + .5rem);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
