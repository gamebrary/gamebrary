<template lang="html">
  <b-row class="p-1 boards">
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <empty-state
        v-if="isEmpty"
        title="Boards"
        message="Use boards to easily organize your video game collections"
      >
        <b-button :to="{ name: 'create.board' }">
          {{ $t('boards.create') }}
        </b-button>
      </empty-state>

      <template v-else>
        <b-col
          v-for="board in gameBoards"
          :key="board.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="px-2 pb-2"
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

    gameBoards() {
      return this.isPublicBoard
        ? this.publicBoards
        : this.sortedBoards;
    },

    isEmpty() {
      return !this.loading && this.gameBoards.length === 0;
    },

    isPublicBoard() {
      return this.$route.name === 'explore';
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      if (this.isPublicBoard) {
        this.loadPublicBoards();
      } else {
        this.loadBoards()
      }
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

    async loadBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
    },

    async loadPublicBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_PUBLIC_BOARDS')
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
