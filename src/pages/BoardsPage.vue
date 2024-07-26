<template lang="html">
    <b-spinner v-if="loading" class="spinner-centered" />
  
    <div v-else>
      <portal to="pageTitle">
        Boards
      </portal>

      <portal to="headerActions">
        <b-button
          v-if="user"
          title="Create board"
          :to="{ name: 'create.board' }"
        >
          <i class="fa-solid fa-plus" />
        </b-button>
      </portal>

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
  
      <div v-else class="board-grid pb-3">
        <mini-board
          v-for="board in sortedBoards"
          :key="board.id"
          :board="board"
          @click.native="$router.push({ name: 'board', params: { id: board.id } })"
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
        return !this.loading && this.gameBoards?.length === 0;
      },
  
      isPublicBoard() {
        return this.$route.name === 'home' && !this.user;
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
  