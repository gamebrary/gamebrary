<template lang="html">
    <b-spinner v-if="loading" class="spinner-centered" />
  
    <div v-else>
      <EmptyState
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
      </EmptyState>
  
      <template v-else>
        <div class="board-grid">
          <mini-board
            v-for="board in sortedPublicBoards"
            :key="board.id"
            :board="board"
            @click.native="$router.push({ name: 'board', params: { id: board.id } })"
          />
        </div>
      </template>
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
      ...mapState(['user', 'wallpapers']),
      ...mapGetters(['isBoardOwner', 'sortedPublicBoards', 'darkTheme', 'navPosition']),
  
      isEmpty() {
        return !this.loading && this.sortedPublicBoards?.length === 0;
      },
    },
  
    mounted() {
      this.load();
    },
  
    methods: {
      load() {
        this.loading = this.gameBoards?.length === 0;
  
        this.loadPublicBoards();
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
  