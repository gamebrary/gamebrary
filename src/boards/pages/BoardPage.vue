<!-- TODO: fix error loading games on public board -->
<!-- TODO: Add tier board type https://tiermaker.com/ -->
<!-- TODO: clone/fork board -->
<!-- TODO: like/favorite board -->
<template lang="html">
  <div>
    <board-placeholder v-if="loading" />

    <template v-else-if="showBoard">
      <portal to="pageTitle">
        <p :class="['mb-0', { 'text-white': backgroundUrl, 'text-outlined': backgroundUrl }]">
          {{ board.name }}
        </p>
      </portal>

      <portal to="headerActions">
        <b-button
          v-if="boardOwner"
          class="mr-2"
          variant="light"
          :to="{ name: 'public.profile', params: { userName: boardOwner.userName }}"
        >
          <!-- TODO: use avatar -->
          <i class="fa fa-user" aria-hidden="true"></i>
          {{ boardOwner.userName }}
        </b-button>

        <b-button
          v-if="isBoardOwner"
          :to="{ name: 'board.edit', params: { id: board.id } }"
          variant="light"
          class="mr-2"
        >
          Edit board
        </b-button>
      </portal>

      <basic-board v-if="board.type === $options.BOARD_TYPE_LIST" />
      <kanban-board v-else />
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
import KanbanBoard from '@/components/Board/KanbanBoard';
import BasicBoard from '@/components/Board/BasicBoard';
import chunk from 'lodash.chunk';
import { BOARD_TYPE_LIST } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  BOARD_TYPE_LIST,

  components: {
    BoardPlaceholder,
    KanbanBoard,
    BasicBoard,
  },

  data() {
    return {
      loading: true,
      queryLimit: 500,
      backgroundUrl: null,
      boardOwner: null,
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

    isBoardCached() {
      return this.board.id === this.boardId;
    },
  },

  watch: {
    backgroundUrl(wallpaperUrl) {
      if (wallpaperUrl) this.$bus.$emit('UPDATE_WALLPAPER', wallpaperUrl);
    },

    boardId(boardId) {
      if (boardId) {
        this.backgroundUrl = null;
        this.loadBoard();
      }
    },
  },

  async mounted() {
    if (!this.isBoardCached) this.$store.commit('CLEAR_BOARD');

    this.loadBoard();
  },

  destroyed() {
    this.$bus.$emit('CLEAR_WALLPAPER');
    this.$bus.$emit('UPDATE_BACKGROUND_COLOR', null);
  },

  methods: {
    async loadBoard() {
      this.loading = !this.isBoardCached;

      await this.$store.dispatch('LOAD_BOARD', this.boardId)
        .catch(() => {
          return this.$router.replace({ name: 'home' });
        });

      if (this.showBoard) {
        if (this.board?.isPublic && !this.isBoardOwner) this.loadPublicProfile();
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
          : await this.$store.dispatch('LOAD_FIREBASE_IMAGE', url);
      } else {
        this.backgroundUrl = null;
      }
    },

    async loadPublicProfile() {
      this.boardOwner = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USER_ID', this.board.owner)
        .catch(() => {});
    },

    loadBoardGames() {
      const { lists } = this.board;

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

.text-outlined {
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
