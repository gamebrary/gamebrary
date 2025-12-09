<template lang="html">
    <div>
      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="board-grid pb-3">
        <MiniBoard
          v-for="board in sortedPublicBoards"
          :key="board.id"
          :board="board"
        />
      </div>
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
            this.showToast('There was an error deleting board', 'danger');
          });

        this.loading = false;
        this.showToast('Board removed', 'success');
      },

      showToast(message, variant = 'info') {
        const toastElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        `;
        document.body.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
      },
    },
  };
  </script>
