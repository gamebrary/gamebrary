<template lang="html">
  <div v-if="user">
    <!-- TODO: allow reorganizing and save -->
    <empty-state
      v-if="!user || !loading && sortedBoards.length === 0"
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <b-button v-b-modal:create-board>
        {{ $t('boards.create') }}
      </b-button>

      <!-- <b-button :to="{ name: 'public-boards' }">
        View public boards
      </b-button> -->
    </empty-state>

    <div class="packery-grid">
      <div v-if="showPlaceholder">
        Loading
      </div>

      <mini-board
        v-for="board in sortedBoards"
        :key="board.id"
        :board="board"
        :background-image="getWallpaperUrl(board.backgroundUrl)"
        class="p-relative"
        @view-board="viewBoard(board.id)"
      >
        <b-button
          size="sm"
          variant="secondary"
          @click.stop="editBoard(board)"
        >
          <i class="fas fa-pencil-alt fa-fw" aria-hidden />
        </b-button>
      </mini-board>

      <!-- TODO: show public boards -->
      <!-- <mini-board
        v-for="board in publicBoards"
        :key="board.id"
        :board="board"
        :background-image="getWallpaperUrl(board.backgroundUrl)"
        class="p-relative"
        @view-board="viewPublicBoard(board.id)"
      >
        <b-button
          class="position-absolute edit-board-button"
          size="sm"
          @click.stop="editBoard(board)"
        >
          <i class="fas fa-pencil-alt fa-fw" aria-hidden />
        </b-button>
      </mini-board> -->
    </div>
  </div>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';
import Packery from 'packery';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    EmptyState,
  },

  data() {
    return {
      loading: false,
      packery: null,
    };
  },

  computed: {
    ...mapState(['publicBoards', 'user', 'boards', 'wallpapers']),
    ...mapGetters(['isBoardOwner', 'platformNames', 'sortedBoards']),

    showPlaceholder() {
      return this.loading && Object.keys(this.boards).length === 0;
    },

    showCreateBoard() {
      return !this.loading && Object.keys(this.boards).length;
    },

    allBoards() {
      // return this.publicBoards
      return [
        ...this.sortedBoards,
        ...this.publicBoards,
      ];
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      if (this.user) {
        this.renderGrid();
        this.loadPlatforms();
      }
    },

    editBoard(board) {
      this.$store.commit('SET_ACTIVE_BOARD', board);
      this.$bvModal.show('edit-board');
    },

    getWallpaperUrl(url) {
      if (!url) {
        return '';
      }

      if (url && url.includes('igdb.com')) {
        return url;
      }

      const wallpaperObject = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaperObject && wallpaperObject.url
        ? wallpaperObject.url
        : '';
    },

    getPlatformImage(id) {
      const { platformNames } = this;

      return id && platformNames && platformNames[id] && platformNames[id].logoFormat
        ? `/static/logos/platforms/${platformNames[id].slug}.${platformNames[id].logoFormat}`
        : '';
    },

    async loadPlatforms() {
      await this.$store.dispatch('LOAD_IGDB_PLATFORMS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading platforms', { variant: 'error' });
        });

      this.loadBoards();

      this.$store.dispatch('LOAD_PUBLIC_BOARDS');
    },

    async loadBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
      this.renderGrid();
    },

    renderGrid() {
      this.packery = this.showPlaceholder && this.user
        ? null
        : new Packery('.packery-grid', { itemSelector: '.mini-board', gutter: 16 });
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },

    viewPublicBoard(id) {
      this.$router.push({ name: 'public-board', params: { id } });
    },

    async deleteBoard(id) {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', id)
        .catch(() => {
          this.loading = false;

          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
    },
  },
};
</script>
