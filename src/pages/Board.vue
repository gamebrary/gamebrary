<template lang="html">
  <div :class="['board', { dragging }]" :style="wallpaper">
    <board-placeholder v-if="loading" />

    <template v-else>
      <list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />

      <div class="d-flex flex-column pr-3">
        <add-list />
        <board-settings />
      </div>
    </template>

    <game-modal />
  </div>
</template>

<script>
import BoardSettings from '@/components/Settings/BoardSettings';
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import AddList from '@/components/Board/AddList';
import GameModal from '@/components/Game/GameModal';
import List from '@/components/Lists/List';
import chunk from 'lodash.chunk';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    List,
    BoardPlaceholder,
    AddList,
    BoardSettings,
    GameModal,
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

    wallpaper() {
      return this.wallpaperUrl
        ? `background-image: url('${this.wallpaperUrl}');`
        : '';
    },

    boardId() {
      return this.$route.params.id;
    },
  },

  watch: {
    boardId(value) {
      if (value) {
        this.load();
      }
    },
  },

  mounted() {
    this.load();

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
  padding: 1rem;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
  display: flex;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
