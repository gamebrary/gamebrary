<template lang="html">
  <b-row class="px-2">
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <empty-state
        v-if="isEmpty && !isPublicBoard"
        title="Boards"
        message="Utilize boards to neatly organize your video games!"
      >
        <b-button
          :to="{ name: 'create.board' }"
          variant="primary"
        >
          {{ $t('boards.create') }}
        </b-button>
      </empty-state>

      <template v-else>
        <portal to="headerActions">
          <b-button
            v-if="user && !isVerticalNav"
            :variant="darkTheme ? 'success' : 'primary'"
            class="mr-3"
            :to="{ name: 'create.board' }"
          >
            <i class="d-sm-none fa-solid fa-plus" />
            <span class="d-none d-sm-inline">Create board</span>
          </b-button>
        </portal>

        <div class="board-grid mx-2">
          <mini-board
            v-for="board in gameBoards"
            :key="board.id"
            :board="board"
            @click.native="$router.push({ name: 'board', params: { id: board.id } })"
          />
        </div>
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

  props: {
    public: Boolean,
  },

  data() {
    return {
      loading: false,
      packery: null,
    };
  },

  computed: {
    ...mapState(['user', 'boards', 'wallpapers']),
    ...mapGetters(['isBoardOwner', 'sortedBoards', 'sortedPublicBoards', 'darkTheme', 'isVerticalNav']),

    gameBoards() {
      return this.isPublicBoard
        ? this.recentlyUpdatedPublicBoards
        : this.sortedBoards;
    },

    recentlyUpdatedPublicBoards() {
      return this.sortedPublicBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 20);
    },

    isEmpty() {
      return !this.loading && this.gameBoards?.length === 0;
    },

    isPublicBoard() {
      return this.public || this.$route.name === 'home' && !this.user;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loading = this.gameBoards?.length === 0;

      if (this.isPublicBoard) {
        this.loadPublicBoards();
      } else {
        this.loadBoards()
      }
    },

    async loadBoards() {
      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;

      if(!this.boards?.length) this.$emit('empty');
    },

    async loadPublicBoards() {
      await this.$store.dispatch('LOAD_PUBLIC_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
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
