<template lang="html">
  <BoardPlaceholder v-if="loading" />

  <div v-else-if="hasAccess">
    <EditListSidebar v-if="isBoardOwner && board.type !== $options.BOARD_TYPE_STANDARD" />
    <CloneBoardSidebar v-if="user" />

    <portal to="pageTitle">
      <div class="d-flex flex-column">
        <h3 :class="['text-truncate', { 'text-white': backgroundUrl && darkTheme }]" :style="publicUserName ? 'line-height: 1rem' : ''">
          {{ board.name }}
        </h3>

        <b-link
          v-if="publicUserName"
          style="font-size: 12px"
          class="mt-1"
          :to="{ name: 'public.profile', params: { userName: publicUserName }}"
        >
          <b-avatar
            rounded
            v-if="avatarImage"
            :src="avatarImage"
            size="16"
            square
            class="mr-1"
          />

          {{ publicUserName }}
        </b-link>
      </div>
    </portal>

    <portal to="headerActions">
      <b-dropdown
        :variant="darkTheme ? 'black' : 'light'"
        right
        no-caret
      >
        <template #button-content>
          <i class="fa-solid fa-ellipsis-vertical px-1" />
        </template>

        <b-dropdown-item v-if="canEdit" v-b-toggle.edit-board-sidebar>
          <i class="fa-solid fa-pen fa-fw" /> Edit board
        </b-dropdown-item>

        <b-dropdown-item v-b-toggle.clone-board-sidebar>
          <i class="fa-regular fa-clone fa-fw" /> Clone board
        </b-dropdown-item>
      </b-dropdown>
    </portal>

    <StandardBoard v-if="board.type === $options.BOARD_TYPE_STANDARD" />
    <TierBoard v-else-if="board.type === $options.BOARD_TYPE_TIER" />
    <GridBoard v-else-if="board.type === $options.BOARD_TYPE_GRID" />
    <KanbanBoard v-else />
  </div>

  <b-alert
    v-else
    variant="warning"
    show
  >
    <span>Private Board</span>
  </b-alert>
</template>

<script>
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import KanbanBoard from '@/components/Board/KanbanBoard';
import GridBoard from '@/components/Board/GridBoard';
import TierBoard from '@/components/Board/TierBoard';
import StandardBoard from '@/components/Board/StandardBoard';
import EditListSidebar from '@/components/Lists/EditListSidebar';
import CloneBoardSidebar from '@/components/CloneBoardSidebar';
import chunk from 'lodash.chunk';
import { getImageThumbnail } from '@/utils';
import {
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,
  BOARD_TYPE_GRID,
  MAX_QUERY_LIMIT
} from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,
  BOARD_TYPE_GRID,

  components: {
    BoardPlaceholder,
    CloneBoardSidebar,
    EditListSidebar,
    GridBoard,
    KanbanBoard,
    StandardBoard,
    TierBoard,
  },

  data() {
    return {
      loading: true,
      avatarImage: null,
      backgroundUrl: null,
      publicProfile: {},
    };
  },

  computed: {
    ...mapState(['user', 'dragging', 'board', 'wallpapers', 'profile']),
    ...mapGetters(['darkTheme', 'isBoardOwner']),

    isBoardPage() {
      return this.$route.name === 'board';
    },

    hasAccess() {
      return this.user || this.board?.isPublic;
    },

    publicUserName() {
      return this.publicProfile?.userName;
    },

    boardId() {
      return this.$route.params?.id;
    },

    isBoardCached() {
      return this.board.id === this.boardId;
    },

    canEdit() {
      return Boolean(this.$route.name === 'board' && this.isBoardOwner);
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
    this.$bus.$on('MOVE_LIST_LEFT', this.moveListLeft);
    this.$bus.$on('MOVE_LIST_RIGHT', this.moveListRight);
    this.$bus.$on('LOAD_BOARD_WALLPAPER', this.loadBoardBackground);
  },

  destroyed() {
    this.$bus.$off('MOVE_LIST_LEFT', this.moveListLeft);
    this.$bus.$off('MOVE_LIST_RIGHT', this.moveListRight);
    this.$bus.$off('LOAD_BOARD_WALLPAPER', this.loadBoardBackground);
    this.$bus.$emit('CLEAR_WALLPAPER');
    this.$bus.$emit('UPDATE_BACKGROUND_COLOR', null);
  },

  methods: {
    moveListLeft(listIndex) {
      if (!this.isBoardOwner) return;

      this.$store.commit('MOVE_LIST_LEFT', listIndex);
      this.saveBoard();
    },

    moveListRight(listIndex) {
      if (!this.isBoardOwner) return;

      this.$store.commit('MOVE_LIST_RIGHT', listIndex);
      this.saveBoard();
    },

    async loadBoard() {
      this.loading = !this.isBoardCached;

      await this.$store.dispatch('LOAD_BOARD', this.boardId)
        .catch(() => {
          return this.$router.replace({ name: 'home' });
        });

      document.title = `${this.board.name} - Gamebrary`;

      if (this.hasAccess) {
        if (this.board?.isPublic && !this.isBoardOwner) this.loadPublicProfile();
        this.loadBoardGames();
        this.loadBoardBackground();
      } else {
        // this.$router.push({ name: 'home' });
      }
    },

    async loadBoardBackground() {
      const backgroundUrl = this.board?.backgroundUrl;

      if (this.board?.backgroundColor) this.$bus.$emit('UPDATE_BACKGROUND_COLOR', this.board?.backgroundColor);
      if (!backgroundUrl) return this.backgroundUrl = null;
      if (backgroundUrl.includes('igdb')) return this.backgroundUrl = backgroundUrl;

      try {
        this.backgroundUrl = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', backgroundUrl);
      } catch (e) {
        if (e?.code === 'storage/object-not-found') this.removeBoardWallpaper();
      }
    },

    async removeBoardWallpaper() {
      const board = { ...this.board, backgroundUrl: null }

      this.$store.commit('SET_ACTIVE_BOARD', board);

      await this.$store.dispatch('SAVE_BOARD');
    },

    async loadPublicProfile() {
      this.publicProfile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USER_ID', this.board?.owner)
        .catch(() => {});

      if (!this.publicProfile?.avatar) return;

      const avatar = getImageThumbnail(this.publicProfile?.avatar);

      this.avatarImage = avatar
        ? await this.$store.dispatch('LOAD_FIREBASE_IMAGE', avatar)
        : null;
    },

    async saveBoard() {
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
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

      return boardGames.length > MAX_QUERY_LIMIT
        ? this.loadGamesInChunks(boardGames)
        : this.loadGames(boardGames);
    },

    async loadGames(gameList) {
      try {
        await this.$store.dispatch('LOAD_IGDB_GAMES', gameList)
      } catch (e) {
        this.$bvToast.toast('Error loading games', { variant: 'error' });
      }

      this.loading = false;
    },

    loadGamesInChunks(gameList) {
      const chunkedGameList = chunk(gameList, MAX_QUERY_LIMIT);

      chunkedGameList.forEach((gameList) => {
        this.loadGames(gameList);
      });
    },
  },
};
</script>
