<template lang="html">
    <div>
      <portal v-if="!this.loading && !isEmpty && user" to="headerActions">
        <b-dropdown
          text="Boards"
          :variant="darkTheme ? 'success' : 'black'"
        >
          <b-dropdown-item-button v-b-toggle.create-board-sidebar>
            <i class="fa-solid fa-plus" />
            Create board
          </b-dropdown-item-button>
        </b-dropdown>
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <EmptyState
        v-else-if="isEmpty"
        title="Boards"
        message="Utilize boards to neatly organize your video games!"
      >
        <b-button
          v-b-toggle.create-board-sidebar
          variant="primary"
        >
          {{ $t('boards.create') }}
        </b-button>
      </EmptyState>

      <div v-else class="board-grid pb-3">
        <MiniBoard
          v-for="board in sortedBoards"
          :key="board.id"
          :board="board"
        />
      </div>
    </div>
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
      ...mapState(['user', 'boards', 'wallpapers']),
      ...mapGetters(['isBoardOwner', 'sortedBoards', 'sortedPublicBoards', 'darkTheme', 'navPosition']),

      recentlyUpdatedPublicBoards() {
        return this.sortedPublicBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 20);
      },

      isEmpty() {
        return this.boards?.length === 0;
      },
    },

    mounted() {
      this.loadBoards()
    },

    methods: {
      async loadBoards() {
        this.loading = this.boards?.length === 0;

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
          .catch((e) => {
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
