<template lang="html">
  <div class="mx-2 mb-2" v-if="user">
    <pre>[ADD ISOTOPE LAYOUT]</pre>
    <pre>[ALLOW REORGANIZING AND SAVE]</pre>
    <pre>[SHOW PUBLIC BOARDS]</pre>
    <div v-if="showPlaceholder" class="boards">
      <b-card
        v-for="n in 3"
        :key="n"
        no-body
        class="mb-3 p-1 mt-3"
      >
        <b-skeleton-img />
      </b-card>
    </div>

    <empty-state
      v-if="!loading && sortedBoards.length === 0"
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <b-button
        :variant="darkTheme ? 'dark' : 'primary'"
        v-b-modal:create-board
      >
        {{ $t('boards.create') }}
      </b-button>
    </empty-state>

    <portal to="dock">
      <b-button
        variant="primary"
        v-b-modal:create-board
      >
        {{ $t('boards.create') }}
      </b-button>
    </portal>

    <div class="boards">
      <b-card
        v-for="board in sortedBoards"
        :key="board.id"
        no-body
        :bg-variant="darkTheme ? 'dark' : null"
        :text-variant="darkTheme ?  'white' : null"
        class="overflow-hidden clickable position-relative"
        @click="viewBoard(board.id)"
      >
        <mini-board
          :board="board"
          :background-image="getWallpaperUrl(board.backgroundUrl)"
        />

        <b-button
          class="position-absolute edit-board-button"
          :variant="darkTheme ?  'info' : 'light'"
          size="sm"
          @click.stop="editBoard(board)"
        >
          <i class="fas fa-edit fa-fw" aria-hidden />
        </b-button>
      </b-card>

      <edit-board-modal />
    </div>
  </div>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import EditBoardModal from '@/components/Board/EditBoardModal';
import EmptyState from '@/components/EmptyState';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    EditBoardModal,
    EmptyState,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['user', 'boards', 'wallpapers', 'gameLists']),
    ...mapGetters(['platformNames', 'sortedBoards', 'darkTheme']),

    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    showPlaceholder() {
      return this.loading && Object.keys(this.boards).length === 0;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadPlatforms();
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
    },

    async loadBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
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

<style lang="scss" rel="stylesheet/scss" scoped>
.boards {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, 320px);
}

.edit-board-button {
  right: .5rem;
  bottom: .5rem;
}
</style>
