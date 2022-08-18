<template lang="html">
  <b-row v-if="user" class="p-1 boards">
    <template v-if="showPlaceholder">
      Loading
    </template>

    <template v-else>
      <empty-state
        v-if="!user || !loading && sortedBoards.length === 0"
        title="Boards"
        message="Use boards to easily organize your video game collections"
      >
        <b-button :to="{ name: 'create.board' }">
          {{ $t('boards.create') }}
        </b-button>

        <!-- <b-button :to="{ name: 'public.boards' }">
          View public boards
        </b-button> -->
      </empty-state>

      <template v-else>
        <b-col
          v-for="board in sortedBoards"
          :key="board.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="p-2"
        >
          <mini-board
            :board="board"
            :background-image="getWallpaperUrl(board.backgroundUrl)"
            @view-board="viewBoard(board.id)"
          />
        </b-col>
      </template>
    </template>
  </b-row>
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
      if (this.user) this.loadPlatforms();
    },

    editBoard(id) {
      // TODO: restore once load board logic is simplified
      this.$router.push({ name: 'board.edit', params: { id } });
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
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },

    viewPublicBoard(id) {
      this.$router.push({ name: 'public.board', params: { id } });
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
}
</style>
