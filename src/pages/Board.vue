<template lang="html">
  <div
    :class="['board', boardBackground, { dragging, 'empty': isEmptyBoard }]"
    :style="wallpaper"
  >
    <board-placeholder v-if="loading" />

    <template v-else>
      <list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />

      <empty-board v-if="isEmptyBoard" class="mr-3" />

      <div :class="['d-flex flex-column', { 'pr-3': !isEmptyBoard }]">
        <add-list />
        <board-settings />
      </div>
    </template>
  </div>
</template>

<script>
import BoardSettings from '@/components/Settings/BoardSettings';
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import EmptyBoard from '@/components/Board/EmptyBoard';
import AddList from '@/components/Board/AddList';
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
    AddList,
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

    wallpaper() {
      return this.wallpaperUrl
        ? `background-image: url('${this.wallpaperUrl}');`
        : '';
    },

    boardId() {
      return this.$route.params.id;
    },

    isEmptyBoard() {
      // TODO: use optional chaining
      return this.board && this.board.lists && this.board.lists.length === 0;
    },

    isPublicBoard() {
      // TODO: use optional chaining
      return this.$route.meta && this.$route.meta.public;
    },

    boardBackground() {
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
    if (this.isPublicBoard) {
      await this.loadPublicBoard(this.boardId);

      this.loadBoardGames();
      this.setWallpaper();
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

      await this.$store.dispatch('LOAD_BOARD_GAMES', gameList.toString())
        .catch(() => {
          this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
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
  padding: 1rem 1rem 0;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
  display: flex;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
