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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
import MiniBoard from '@/components/Board/MiniBoard';

const router = useRouter();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const { sortedPublicBoards, darkTheme, isBoardOwner } = useAppGetters();

const loading = ref(false);

const user = computed(() => userStore.user);

const isEmpty = computed(() => {
  return !loading.value && sortedPublicBoards.value?.length === 0;
});

const loadPublicBoards = async () => {
  try {
    loading.value = true;
    await boardsStore.loadPublicBoards();
  } catch (e) {
    loading.value = false;
    userStore.setSessionExpired(true);
  }
  loading.value = false;
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

onMounted(() => {
  loadPublicBoards();
});
</script>
