<template lang="html">
  <div
    :class="['board px-3 pb-3', { dragging, empty }]"
  >
    <board-placeholder v-if="loading" />

    <template v-else-if="showBoard">
      <portal to="pageTitle">
        <b-button variant="light" disabled>
          {{ board.name }}
        </b-button>
        <!-- TODO: show back button to board, store in memory only -->
      </portal>

      <portal to="headerActions">
        <b-button
          :to="{ name: 'board.edit', params: { id: board.id } }"
          variant="light"
          class="mr-2"
        >
          Edit
        </b-button>
      </portal>

      <!-- TODO: put board in component -->
      <game-list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />

      <empty-board v-if="empty" />

      <add-list v-else-if="user && user.uid && user.uid === board.owner" />
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
import EmptyBoard from '@/components/Board/EmptyBoard';
import AddList from '@/components/Board/AddList';
import GameList from '@/components/Lists/GameList';
import chunk from 'lodash.chunk';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameList,
    BoardPlaceholder,
    EmptyBoard,
    AddList,
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

    boardId() {
      return this.$route.params?.id;
    },

    empty() {
      return this.board?.lists?.length === 0;
    },
  },

  watch: {
    backgroundUrl(value) {
      if (value) this.$bus.$emit('UPDATE_WALLPAPER', value);
    },

    boardId(boardId) {
      if (boardId) this.load();
    },
  },

  async mounted() {
    // TODO: only clear board if not already cached

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

    // TODO: is this needed? remove if not!
    this.$bus.$on('LOAD_BOARD_BACKGROUND', this.loadBoardBackground);
  },

  destroyed() {
    this.$bus.$off('LOAD_BOARD_BACKGROUND');
    this.$bus.$emit('UPDATE_WALLPAPER', null);
    this.$bus.$emit('UPDATE_BACKGROUND_COLOR', null);
  },

  methods: {
    load() {
      this.backgroundUrl = null;

      if (this.boardId && this.user) {
        this.loadBoard(this.boardId);
      } else {
        // TODO: show board not found message?
        this.$router.push({ name: 'boards' });
      }
    },

    // TODO: handle all extra logic in store
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

      if (this.board?.backgroundColor) this.$bus.$emit('UPDATE_BACKGROUND_COLOR', this.board?.backgroundColor);

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
        // TODO: toggle add list
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
  align-items: flex-start;
  min-height: calc(100vh - 62px);
  width: 100vw;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
