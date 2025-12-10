<!-- TODO: Add transparency setting here -->
<!-- TODO: fix Lists will be merged into a single list. -->
<!-- TODO: allow to upload and set wallpaper from here -->
<template lang="html">
  <AppSidebar id="edit-board-sidebar" :visible="visible" :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant" :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange">
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit board" />
    </template>

    <form @submit.stop.prevent="saveBoard" class="p-3">
      <AppSidebar id="select-board-wallpaper" :visible="wallpaperSidebarVisible"
        :placement="sidebarRightProps?.placement || 'end'" :bg-variant="sidebarRightProps?.bgVariant"
        :text-variant="sidebarRightProps?.textVariant" @update:visible="handleWallpaperVisibilityChange">
        <template #header>
          <SidebarHeader @hide="hideWallpaperSidebar" title="Select board background" />
        </template>

        <div class="p-3">
          <UploadWallpaperButton class="mb-3" />
          <WallpapersList selectable :selected="board.backgroundUrl" @select="selectWallpaper" />
        </div>
      </AppSidebar>

      <div class="mb-3">
        <label for="name" class="form-label">Board name</label>
        <input id="name" type="text" v-model="board.name" class="form-control" required />
      </div>

      <p>Board type:</p>

      <div class="btn-group mb-3" role="group">
        <button v-for="{ text, value } in BOARD_TYPES" :key="value" type="button" class="btn"
          :class="value === board.type ? 'btn-dark' : 'btn-light'" @click="board.type = value">
          {{ text }}
        </button>
      </div>

      <div v-if="needsFlattening" class="alert alert-warning" role="alert">
        Lists will be merged into a single list.
      </div>

      <MiniBoard class="mb-3" :board="previewBoard" no-link />

      <div v-if="board.type === BOARD_TYPE_STANDARD" class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" v-model="board.ranked" id="rankedSwitch" />
        <label class="form-check-label" for="rankedSwitch">
          Ranked
        </label>
      </div>

      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" v-model="board.darkTheme" id="darkThemeSwitch" />
        <label class="form-check-label" for="darkThemeSwitch">
          Dark theme
        </label>
      </div>

      <div class="d-flex justify-content-between mb-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="board.isPublic" id="isPublicSwitch" />
          <label class="form-check-label" for="isPublicSwitch">
            Public
          </label>
        </div>

        <a v-if="board.isPublic" class="link-primary float-end" target="_blank"
          :href="`https://gamebrary.com/b/${board.id}`">
          Open board
        </a>
      </div>

      <div class="d-flex align-items-start">
        <input type="color" v-model="board.backgroundColor" class="form-control form-control-color mb-3"
          style="width: 40px; height: 40px; cursor: pointer;" title="Background color" />

        <button v-if="board.backgroundColor" type="button" class="btn btn-light ms-2"
          @click="board.backgroundColor = null">
          <i class="fas fa-close" aria-hidden />
        </button>

        <span class="mt-2 ms-2">Background color</span>
      </div>

      <div class="d-flex align-items-center mb-3">
        <button type="button" class="btn btn-primary me-2" data-bs-toggle="offcanvas"
          data-bs-target="#select-board-wallpaper">
          <i class="fa fa-image" aria-hidden="true"></i>
        </button>

        <button v-if="board.backgroundUrl" type="button" class="btn btn-light me-2" @click="board.backgroundUrl = null">
          <i class="fas fa-close" aria-hidden />
        </button>

        Background image
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>{{ t('global.save') }}</span>
      </button>

      <button type="button" class="btn btn-outline-danger float-end" @click="confirmDeleteBoard">
        {{ t('board.settings.deleteBoard') }}
      </button>
    </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
import { useI18n } from 'vue-i18n';
import {
  BOARD_TYPES,
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_GRID,
  BOARD_TYPE_KANBAN,
  LIST_SORT_OPTIONS,
} from '@/constants';
import WallpapersList from '@/components/WallpapersList';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import MiniBoard from '@/components/Board/MiniBoard';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { darkTheme, sidebarRightProps } = useAppGetters();
const { t } = useI18n();
const $bus = inject('$bus');

// Reactive state
const board = ref({});
const loading = ref(false);
const saving = ref(false);
const lists = ref([]);
const visible = ref(false);
const wallpaperSidebarVisible = ref(false);

// Store state and getters
const user = computed(() => userStore.user);

// Computed properties
const boardId = computed(() => route?.params?.id);

const needsFlattening = computed(() => {
  const listCount = board.value?.lists?.length || 0;
  if (!listCount) return false;
  return [BOARD_TYPE_STANDARD, BOARD_TYPE_GRID].includes(board.value.type);
});

const mergedGamesList = computed(() => {
  return [...new Set(board.value?.lists?.map(({ games }) => games)?.flat())];
});

const previewBoard = computed(() => {
  return needsFlattening.value
    ? standardPreviewBoard.value
    : board.value;
});

const standardPreviewBoard = computed(() => {
  return {
    ...board.value,
    lists: [{ name: '', games: mergedGamesList.value }],
  };
});

// Watchers
watch(boardId, (id) => {
  if (id) loadBoard();
});

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const handleWallpaperVisibilityChange = (newVisible) => {
  wallpaperSidebarVisible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
};

const hideWallpaperSidebar = () => {
  wallpaperSidebarVisible.value = false;
};

const loadBoard = async () => {
  if (!boardId.value) {
    return;
  }

  try {
    loading.value = true;

    await store.dispatch('LOAD_WALLPAPERS');
    const loadedBoard = await store.dispatch('LOAD_BOARD', boardId.value);

    board.value = {
      type: BOARD_TYPE_KANBAN,
      ...loadedBoard,
    };

    lists.value = JSON.parse(JSON.stringify(board.value.lists || []));
  } catch (e) {
    console.error('Error loading board:', e);
  } finally {
    loading.value = false;
  }
};

const setListSorting = (index, value) => {
  lists.value[index].sortOrder = value;
};

const setListView = (index, value) => {
  lists.value[index].view = value;
};

const confirmDeleteBoard = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this board?');
  if (confirmed) {
    await deleteBoard();
  }
};

const deleteBoard = async () => {
  try {
    saving.value = true;

    await store.dispatch('DELETE_BOARD', boardId.value);
    showToast('Board deleted', 'success');
    router.push({ name: 'boards' });
  } catch (e) {
    showToast('There was an error deleting board', 'danger');
  } finally {
    saving.value = false;
  }
};

const selectWallpaper = (wallpaper) => {
  board.value.backgroundUrl = wallpaper;
  hideWallpaperSidebar();
};

const saveBoard = async () => {
  try {
    saving.value = true;

    if (needsFlattening.value) {
      const payload = {
        ...board.value,
        lastUpdated: Date.now(),
        lists: [{ name: '', games: mergedGamesList.value }],
      };

      store.commit('SET_ACTIVE_BOARD', payload);
    } else {
      store.commit('SET_ACTIVE_BOARD', {
        ...board.value,
        lastUpdated: Date.now(),
      });
    }

    await store.dispatch('SAVE_BOARD');
    showToast('Board saved', 'success');
    hideSidebar();
  } catch (e) {
    showToast('There was an error saving board', 'danger');
  } finally {
    saving.value = false;
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
  if (boardId.value) loadBoard();
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'edit-board-sidebar') {
        visible.value = !visible.value;
      } else if (id === 'select-board-wallpaper') {
        wallpaperSidebarVisible.value = !wallpaperSidebarVisible.value;
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
