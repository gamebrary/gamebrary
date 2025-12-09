<template lang="html">
  <BoardPlaceholder v-if="loading" />

  <div v-else-if="hasAccess">
    <EditListSidebar v-if="isBoardOwner && board.type !== $options.BOARD_TYPE_STANDARD" />
    <CloneBoardSidebar v-if="user" />

    <portal to="headerActions">
      <div v-if="user" class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-dark' : 'btn-dark'"
          type="button"
          id="boardActionsDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ board.name }}
          <i class="fa-regular fa-caret-down fa-fw" />
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="boardActionsDropdown">
          <li v-if="canEdit">
            <a class="dropdown-item" href="#" @click.prevent="$root.$emit('bv::toggle::collapse', 'edit-board-sidebar')">
              <i class="fa-solid fa-pen fa-fw" /> Edit board
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="$root.$emit('bv::toggle::collapse', 'clone-board-sidebar')">
              <i class="fa-regular fa-clone fa-fw" /> Clone board
            </a>
          </li>
          <li v-if="publicUserName">
            <router-link
              class="dropdown-item d-flex align-items-center"
              :to="{ name: 'public.profile', params: { userName: publicUserName }}"
            >
              <img
                v-if="avatarImage"
                :src="avatarImage"
                class="rounded-circle me-1"
                style="width: 24px; height: 24px; object-fit: cover;"
                alt=""
              />
              {{ publicUserName }}
            </router-link>
          </li>
        </ul>
      </div>

      <button
        v-else
        type="button"
        class="btn"
        :class="darkTheme ? 'btn-dark' : 'btn-dark'"
      >
        {{ board.name }}
      </button>
    </portal>

    <StandardBoard v-if="board.type === $options.BOARD_TYPE_STANDARD" />
    <TierBoard v-else-if="board.type === $options.BOARD_TYPE_TIER" />
    <GridBoard v-else-if="board.type === $options.BOARD_TYPE_GRID" />
    <KanbanBoard v-else />
  </div>

  <div v-else class="alert alert-warning" role="alert">
    <span>Private Board</span>
  </div>
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
        this.showToast('Error loading games', 'danger');
      }

      this.loading = false;
    },

    showToast(message, variant = 'info') {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
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
