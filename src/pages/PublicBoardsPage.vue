<template lang="html">
    <b-spinner v-if="loading" class="spinner-centered" />
  
    <div v-else class="board-grid">
      <MiniBoard
        v-for="board in sortedPublicBoards"
        :key="board.id"
        :board="board"
        @click.native="$router.push({ name: 'board', params: { id: board.id } })"
      />
    </div>
  </template>
  
  <script>
  import MiniBoard from '@/components/Board/MiniBoard';
  import { mapState, mapGetters } from 'vuex';
  
  export default {
    components: {
      MiniBoard,
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
  