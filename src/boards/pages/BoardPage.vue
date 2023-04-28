<template lang="html">
  <div>
    <board-placeholder v-if="loading" />

    <template v-else-if="hasAccess">
      <edit-list-modal />

      <portal to="pageTitle">
        <div :class="{ 'd-flex align-items-baseline': publicUserName }">
          <h3 :class="[{ 'text-white': backgroundUrl }]">
            {{ board.name }}

            <small v-if="publicUserName">
              by

              <b-link
                :class="['mr-2', { 'text-white': backgroundUrl } ]"
                :to="{ name: 'public.profile', params: { userName: publicUserName }}"
              >
                <b-avatar
                  rounded
                  v-if="avatarImage"
                  :src="avatarImage"
                  :title="`@${publicUserName}`"
                  v-b-tooltip.hover
                />

                @{{ publicUserName }}
              </b-link>
            </small>
          </h3>
        </div>
      </portal>

      <portal to="headerActions">
        <b-button
          v-if="isBoardOwner"
          :to="{ name: 'board.edit', params: { id: board.id } }"
          :variant="darkTheme ? 'secondary' : 'light'"
          class="mr-2"
        >
          <span class="d-none d-sm-block">Edit board</span>
          <i class="fa fa-pen d-sm-none" aria-hidden="true" />
        </b-button>
      </portal>

      <standard-board v-if="board.type === $options.BOARD_TYPE_STANDARD" />
      <tier-board v-else-if="board.type === $options.BOARD_TYPE_TIER" />
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
import TierBoard from '@/components/Board/TierBoard';
import StandardBoard from '@/components/Board/StandardBoard';
import EditListModal from '@/components/Lists/EditListModal';
import chunk from 'lodash.chunk';
import { getImageThumbnail } from '@/utils';
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER, MAX_QUERY_LIMIT } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,

  components: {
    BoardPlaceholder,
    KanbanBoard,
    TierBoard,
    EditListModal,
    StandardBoard,
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
    ...mapState(['user', 'dragging', 'board', 'wallpapers']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

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

      if (this.hasAccess) {
        if (this.board?.isPublic && !this.isBoardOwner) this.loadPublicProfile();
        this.loadBoardGames();
        this.loadBoardBackground();
      } else {
        this.$router.push({ name: 'explore' });
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
      this.publicProfile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USER_ID', this.board.owner)
        .catch(() => {});

      if (!this.profile?.avatar) return;

      const avatar = getImageThumbnail(this.profile?.avatar);

      this.avatarImage = avatar
        ? await this.$store.dispatch('LOAD_FIREBASE_IMAGE', avatar)
        : null;
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
        await this.$store.dispatch('LOAD_GAMES', gameList)
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
