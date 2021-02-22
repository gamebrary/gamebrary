<template lang="html">
  <b-container>
    <!-- TODO: allow board settings to be accessed here -->
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
      v-else-if="!boards.length"
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

    <div v-else class="d-flex w-100 justify-content-between align-items-center mb-3">
      <h3 class="m-0 mr-a">{{ $t('boards.title') }}</h3>

      <b-button
        variant="primary"
        v-b-modal:create-board
      >
        {{ $t('boards.create') }}
      </b-button>
    </div>

    <div class="boards">
      <b-card
        v-for="board in sortedBoards"
        :key="board.id"
        no-body
        :bg-variant="darkTheme ? 'dark' : null"
        :text-variant="darkTheme ?  'white' : null"
        class="overflow-hidden clickable"
        @click="viewBoard(board.id)"
      >
        <mini-board
          :board="board"
          :background-image="getWallpaper(board)"
        />
      </b-card>
    </div>
  </b-container>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    EmptyState,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'gameLists']),
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

    getWallpaper({ wallpaper }) {
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length > 0 && boardWallpaper && boardWallpaper.url
        ? boardWallpaper.url
        : null;
    },

    getPlatformImage(id) {
      const { platformNames } = this;

      return id && platformNames && platformNames[id] && platformNames[id].logoFormat
        ? `/static/platform-logos/${platformNames[id].slug}.${platformNames[id].logoFormat}`
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
</style>
