<template lang="html">
  <div class="px-3">
    <portal v-if="!loading && !isEmpty && user" to="headerActions">
      <div class="d-flex justify-content-end">
        <button type="button" class="btn" :class="darkTheme ? 'btn-success' : 'btn-primary'" data-bs-toggle="offcanvas"
          data-bs-target="#create-board-sidebar">
          <PhPlus :size="16" weight="fill" class="me-1" />
          Create board
        </button>
      </div>
    </portal>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <EmptyState v-else-if="isEmpty" title="Boards" message="Utilize boards to neatly organize your video games!">
      <button type="button" class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#create-board-sidebar">
        {{ t('boards.create') }}
      </button>
    </EmptyState>

    <BoardGrid v-else class="pb-3">
      <MiniBoard v-for="board in sortedBoards" :key="board.id" :board="board" />
    </BoardGrid>

    <div v-if="!loading && !isEmpty && hasMoreBoards" class="d-flex justify-content-center mt-4 mb-3">
      <button type="button" class="btn" :class="darkTheme ? 'btn-success' : 'btn-primary'" @click="loadMoreBoards"
        :disabled="loadingMore">
        <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2" role="status"></span>
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useBoardsStore } from '@/stores/boards';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters } from '@/stores/getters';
import { useI18n } from 'vue-i18n';
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';
import BoardGrid from '@/components/BoardGrid';
import { PhPlus } from '@phosphor-icons/vue';

const router = useRouter();
const userStore = useUserStore();
const boardsStore = useBoardsStore();
const wallpapersStore = useWallpapersStore();
const { isBoardOwner, sortedPublicBoards, darkTheme } = useAppGetters();
const { t } = useI18n();

// Reactive state
const loading = ref(false);
const loadingMore = ref(false);

// Store state and getters
const user = computed(() => userStore.user);
const boards = computed(() => boardsStore.boards);
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Computed properties
const sortedBoards = computed(() => {
  if (!boards.value || !Array.isArray(boards.value)) return [];
  return [...boards.value].sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
});

const recentlyUpdatedPublicBoards = computed(() => {
  return sortedPublicBoards.value.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 20);
});

const isEmpty = computed(() => !boards.value || boards.value.length === 0);
const hasMoreBoards = computed(() => boardsStore.boardsHasMore);

// Methods
const loadBoards = async () => {
  loading.value = boards.value?.length === 0;

  try {
    if (!userStore.user?.uid) {
      console.error('No user ID available');
      loading.value = false;
      return;
    }

    await boardsStore.loadBoards(userStore.user.uid, { reset: true });
  } catch (e) {
    // The store should handle index errors with fallback, but log if something else fails
    if (e?.code !== 'failed-precondition' && !e?.message?.includes('index')) {
      console.error('Error loading boards:', e);
    }
    loading.value = false;
    // TODO: Handle session expired in user store
    // userStore.setSessionExpired(true);
  }

  loading.value = false;
};

const loadMoreBoards = async () => {
  loadingMore.value = true;

  try {
    await boardsStore.loadBoards(userStore.user.uid, { reset: false });
  } catch (e) {
    // Error handling
  } finally {
    loadingMore.value = false;
  }
};

const loadPublicBoards = async () => {
  try {
    await boardsStore.loadPublicBoards();
  } catch (e) {
    loading.value = false;
    // TODO: Handle session expired in user store
    // userStore.setSessionExpired(true);
  }

  loading.value = false;
};

const viewPublicBoard = (id) => {
  router.push({ name: 'public.board', params: { id } });
};

const deleteBoard = async (id) => {
  loading.value = true;

  try {
    await boardsStore.deleteBoard(id);
    showToast('Board removed', 'success');
  } catch (e) {
    showToast('There was an error deleting board', 'danger');
  } finally {
    loading.value = false;
  }
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
