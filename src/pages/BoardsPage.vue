<template lang="html">
    <div class="px-3">
      <portal v-if="!loading && !isEmpty && user" to="headerActions">
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
          {{ t('boards.create') }}
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';

const router = useRouter();
const store = useStore();
const { t } = useI18n();

// Reactive state
const loading = ref(false);

// Store state and getters
const user = computed(() => store.state.user);
const boards = computed(() => store.state.boards);
const wallpapers = computed(() => store.state.wallpapers);
const isBoardOwner = computed(() => store.getters.isBoardOwner);
const sortedBoards = computed(() => store.getters.sortedBoards);
const sortedPublicBoards = computed(() => store.getters.sortedPublicBoards);
const darkTheme = computed(() => store.getters.darkTheme);
const navPosition = computed(() => store.getters.navPosition);

// Computed properties
const recentlyUpdatedPublicBoards = computed(() => {
  return sortedPublicBoards.value.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 20);
});

const isEmpty = computed(() => boards.value?.length === 0);

// Methods
const loadBoards = async () => {
  loading.value = boards.value?.length === 0;

  await store.dispatch('LOAD_BOARDS')
    .catch(() => {
      loading.value = false;
      store.commit('SET_SESSION_EXPIRED', true);
    });

  loading.value = false;
};

const loadPublicBoards = async () => {
  await store.dispatch('LOAD_PUBLIC_BOARDS')
    .catch((e) => {
      loading.value = false;
      store.commit('SET_SESSION_EXPIRED', true);
    });

  loading.value = false;
};

const viewPublicBoard = (id) => {
  router.push({ name: 'public.board', params: { id } });
};

const deleteBoard = async (id) => {
  loading.value = true;

  await store.dispatch('DELETE_BOARD', id)
    .catch(() => {
      loading.value = false;
      showToast('There was an error deleting board', 'danger');
    });

  loading.value = false;
  showToast('Board removed', 'success');
};

const showToast = (message, variant = 'info') => {
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
};

// Lifecycle hooks
onMounted(() => {
  loadBoards();
});
</script>
