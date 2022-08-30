<template lang="html">
  <div
    :class="['board px-3 pb-3', { dragging, empty }]"
  >
    <board-placeholder v-if="loading" />

    <template v-else-if="showBoard">
      <portal to="pageTitle">
        {{ board.name }}
        <!-- <template v-if="!isBoardOwner">by <strong>{{ board.owner }}</strong></template> -->
      </portal>
      <portal to="headerActions">
        <b-button
          v-if="isBoardOwner"
          :to="{ name: 'board.edit', params: { id: board.id } }"
          variant="light"
          class="mr-2"
        >
          Edit board
        </b-button>
      </portal>

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

    showBoard() {
      return this.user || this.board?.isPublic;
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
      if (boardId) {
        this.backgroundUrl = null;
        this.loadBoard();
      }
    },
  },

  async mounted() {
    this.loadBoard();
    this.$store.commit('CLEAR_BOARD'); // TODO: only clear board if not already cached
  },

  destroyed() {
    this.$bus.$emit('UPDATE_WALLPAPER', null);
    this.$bus.$emit('UPDATE_BACKGROUND_COLOR', null);
  },

  methods: {
    async loadBoard() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD', this.boardId)
        .catch(() => {
          return this.$router.replace({ name: 'home' });
        });

      if (this.showBoard) {
        this.loadBoardGames();
        this.loadBoardBackground();
      } else {
        this.$router.push({ name: 'explore' });
      }
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

      if (lists?.length === 0) {
        // TODO: handle empty boards?
      }

      const boardGames = lists?.length
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
  width: 100vw;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
