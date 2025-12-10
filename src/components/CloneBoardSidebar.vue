<template lang="html">
  <AppSidebar id="clone-board-sidebar" :visible="visible" :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant" :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange" @shown="setBoardName">
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Clone board" />
    </template>

    <form @submit.prevent="cloneBoard" class="px-3">
      <div class="mb-3">
        <label for="boardName" class="form-label">Board name:</label>
        <input id="boardName" type="text" v-model.trim="boardName" class="form-control" autofocus required />
      </div>

      <MiniBoard class="mb-2" :board="board" no-link />

      <button type="submit" class="btn" :class="darkTheme ? 'btn-secondary' : 'btn-primary'" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>Clone board</span>
      </button>
    </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import MiniBoard from '@/components/Board/MiniBoard';
import { BOARD_TYPE_KANBAN } from '@/constants';

const router = useRouter();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const { sidebarRightProps, darkTheme } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const boardName = ref('');
const saving = ref(false);
const visible = ref(false);

// Store state and getters
const board = computed(() => boardsStore.board);
const user = computed(() => userStore.user);

// Computed properties
const payload = computed(() => {
  const dateCreated = Date.now();

  const isBoardOwner = board.value.owner === user.value.uid;

  const backgroundUrl = isBoardOwner
    ? board.value.backgroundUrl
    : null;

  return {
    type: board.value.type || BOARD_TYPE_KANBAN,
    lists: board.value.lists,
    ranked: board.value.ranked || false,
    backgroundUrl: backgroundUrl || null,
    backgroundColor: board.value?.backgroundColor || null,
    lastUpdated: board.value.lastUpdated || dateCreated,
    darkTheme: board.value.darkTheme || false,
    dateCreated: board.value.dateCreated || dateCreated,
    originalOwnerId: board.value.owner,
    isPublic: false,
    dateCreated,
    lastUpdated: dateCreated,
    originalBoardId: board.value.id,
    originalDateCreated: board.value.dateCreated || dateCreated,
    owner: user.value.uid,
    name: boardName.value,
  };
});

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
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

const setBoardName = () => {
  boardName.value = board.value.name || '';
};

const cloneBoard = async () => {
  try {
    saving.value = true;

    const newBoard = await boardsStore.createBoard(payload.value);
    const { id } = newBoard;
    showToast('Board cloned', 'success');
    saving.value = false;
    router.push({ name: 'board', params: { id } });
  } catch (e) {
    console.log(e);
  }
};

// Lifecycle hooks
onMounted(() => {
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'clone-board-sidebar') {
        visible.value = !visible.value;
      }
    });
  }
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('bv::toggle::collapse');
  }
});
</script>
