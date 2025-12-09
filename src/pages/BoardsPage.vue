<template lang="html">
    <div class="px-3">
      <portal v-if="!this.loading && !isEmpty && user" to="headerActions">
        <div class="dropdown">
          <button
            class="btn dropdown-toggle"
            :class="darkTheme ? 'btn-success' : 'btn-dark'"
            type="button"
            id="boardsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Boards
          </button>
          <ul class="dropdown-menu" aria-labelledby="boardsDropdown">
            <li>
              <button
                type="button"
                class="dropdown-item"
                :class="darkTheme ? 'text-light' : ''"
                data-bs-toggle="offcanvas"
                data-bs-target="#create-board-sidebar"
              >
                <i class="fa-solid fa-plus" />
                Create board
              </button>
            </li>
          </ul>
        </div>
      </portal>

      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <EmptyState
        v-else-if="isEmpty"
        title="Boards"
        message="Utilize boards to neatly organize your video games!"
      >
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="offcanvas"
          data-bs-target="#create-board-sidebar"
        >
          {{ $t('boards.create') }}
        </button>
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
