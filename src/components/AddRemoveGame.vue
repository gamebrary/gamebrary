<template lang="html">
  <AppSidebar
    id="addRemoveGameSidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <SidebarHeader
        :title="`Add or remove ${game?.name || 'game'} to list`"
        @hide="hideSidebar"
      />
    </template>

      <div class="px-3 pb-3">
        <ul class="list-group">
          <li
            v-for="board in boards"
            :key="board.id"
            class="list-group-item"
            :class="darkTheme ? 'bg-dark text-light' : 'bg-light'"
          >
            <div
              class="cursor-pointer d-flex align-items-center"
              @click="selectedBoard = selectedBoard === board.id ? null : board.id"
            >
              <MiniBoard
                class="cursor-pointer"
                :board="board"
                thumbnail
              />

              <h3 class="mx-2 mb-0">{{ board.name }}</h3>
            </div>

            <div
              v-show="selectedBoard === board.id"
              class="collapse mt-2"
              :class="{ 'show': selectedBoard === board.id }"
            >
              <ul class="list-group">
                <li
                  v-for="(list, listIndex) in board.lists"
                  :key="listIndex"
                  class="list-group-item d-flex justify-content-between align-items-center"
                  :class="darkTheme ? 'bg-dark text-light' : 'bg-light'"
                >
                  {{ list.name || '[Unnamed]' }}

                  <button
                    type="button"
                    class="btn btn-sm"
                    :class="isGameInList({ list }) ? 'btn-danger' : 'btn-success'"
                    @click="handleClick({ list, listIndex, board })"
                  >
                    {{ isGameInList({ list }) ? 'Remove' : 'Add' }}
                    <i
                      :class="`fa fa-${isGameInList({ list }) ? 'trash' : 'plus'}`"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useStore } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const store = useStore();
const $bus = inject('$bus');

// Reactive state
const selectedBoard = ref(null);
const visible = ref(false);

// Store state and getters
const boards = computed(() => store.state.boards);
const wallpapers = computed(() => store.state.wallpapers);
const game = computed(() => store.state.game);
const darkTheme = computed(() => store.getters.darkTheme);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);

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

const isGameInList = ({ list }) => {
  return list.games?.includes(Number(game.value?.id));
};

const getWallpaperUrl = (url) => {
  if (!url) return '';
  if (url?.includes('igdb.com')) return url;

  const wallpaper = wallpapers.value.find(({ fullPath }) => fullPath === url);

  return wallpaper?.url ? decodeURI(wallpaper.url) : '';
};

const handleClick = ({ list, listIndex, board }) => {
  if (isGameInList({ list, gameId: game.value.id })) {
    removeGame({ listIndex, boardId: board.id, list });
  } else {
    addGame({ list, listIndex, boardId: board.id });
  }
};

const addGame = async ({ list, listIndex, boardId }) => {
  const boardIndex = boards.value.findIndex(({ id }) => id === boardId);
  const boardToUpdate = boards.value[boardIndex];

  boardToUpdate.lists[listIndex].games.push(game.value.id);

  try {
    await store.dispatch('SAVE_GAME_BOARD', boardToUpdate);
    showToast(`Added "${game.value.name}" to ${list.name || 'list'}`, 'success');
  } catch (e) {
    showToast(`Error adding "${game.value.name}"`, 'danger');
  }
};

const removeGame = async ({ listIndex, boardId }) => {
  const boardIndex = boards.value.findIndex(({ id }) => id === boardId);
  const boardToUpdate = boards.value[boardIndex];
  const gameIndex = boardToUpdate.lists[listIndex].games.indexOf(game.value?.id);

  boardToUpdate.lists[listIndex].games.splice(gameIndex, 1);

  try {
    await store.dispatch('SAVE_GAME_BOARD', boardToUpdate);
    showToast(`Removed "${game.value.name}" from list`, 'success');
  } catch (e) {
    showToast(`Error removing "${game.value.name}"`, 'danger');
  }
};

// Lifecycle hooks
onMounted(() => {
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'addRemoveGameSidebar') {
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
