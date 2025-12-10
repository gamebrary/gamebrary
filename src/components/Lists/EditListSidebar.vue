<template>
  <AppSidebar
    id="edit-list-modal"
    :visible="activeBoardListIndex !== null"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="openEditListSidebar"
    @hidden="closeSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit list" />
    </template>

    <form
      class="px-3"
      @submit.prevent="saveList"
    >
      <div
        v-if="board.type === 'tier'"
        class="d-flex justify-content-between align-items-start"
      >
        <input
          type="color"
          v-model="list.backgroundColor"
          class="form-control form-control-color"
          style="width: 40px; height: 40px; cursor: pointer;"
          title="Background color"
        />

        <input
          id="name"
          type="text"
          class="form-control ms-3"
          v-model.trim="list.name"
        />
      </div>

      <template v-else>
        <h4>List name</h4>

        <input
          id="name"
          type="text"
          class="form-control"
          v-model.trim="list.name"
        />

        <section class="mt-3">
          <h4>Sort by</h4>

          <select
            v-model="list.sortBy"
            class="form-select"
            :class="{ 'mb-3': list.sortBy }"
          >
            <option v-for="option in LIST_SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <small class="text-secondary" v-if="!list.sortBy">
            <i class="far fa-hand-paper" aria-hidden="true"></i>
            Drag and drop
          </small>
        </section>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.vertical"
            id="verticalSwitch"
          />
          <label class="form-check-label" for="verticalSwitch">Vertical layout</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.smallCover"
            id="smallCoverSwitch"
          />
          <label class="form-check-label" for="smallCoverSwitch">Small covers</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideCover"
            id="hideCoverSwitch"
          />
          <label class="form-check-label" for="hideCoverSwitch">Hide covers</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.showGameCount"
            id="showGameCountSwitch"
          />
          <label class="form-check-label" for="showGameCountSwitch">Show game count</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideTitle"
            id="hideTitleSwitch"
          />
          <label class="form-check-label" for="hideTitleSwitch">Hide game title</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideTags"
            id="hideTagsSwitch"
          />
          <label class="form-check-label" for="hideTagsSwitch">Hide game tags</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideRibbon"
            id="hideRibbonSwitch"
          />
          <label class="form-check-label" for="hideRibbonSwitch">Hide game ribbon</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideNotes"
            id="hideNotesSwitch"
          />
          <label class="form-check-label" for="hideNotesSwitch">Hide game notes</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hidePlatforms"
            id="hidePlatformsSwitch"
          />
          <label class="form-check-label" for="hidePlatformsSwitch">Hide game platforms</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideProgress"
            id="hideProgressSwitch"
          />
          <label class="form-check-label" for="hideProgressSwitch">Hide progress</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.ranked"
            id="rankedSwitch"
          />
          <label class="form-check-label" for="rankedSwitch">Ranked</label>
        </div>
      </template>

      <footer class="py-3 d-flex align-items-center">
        <button
          type="submit"
          class="btn btn-dark"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>{{ t('global.save') }}</span>
        </button>

        <button
          type="button"
          class="btn btn-outline-danger ms-auto"
          @click="confirmDeleteList"
        >
          Delete
        </button>
      </footer>
    </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useBoardsStore } from '@/stores/boards';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import { useI18n } from 'vue-i18n';
import { LIST_SORT_OPTIONS } from '@/constants';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const boardsStore = useBoardsStore();
const uiStore = useUIStore();
const { darkTheme, sidebarRightProps } = useAppGetters();
const { t } = useI18n();
const $bus = inject('$bus');

// Reactive state
const list = ref({});
const saving = ref(false);

// Store state and getters
const board = computed(() => boardsStore.board);
const activeBoardListIndex = computed(() => uiStore.activeBoardListIndex);

// Watchers
watch(activeBoardListIndex, (newIndex) => {
  if (newIndex === null && list.value) {
    list.value = {};
  }
});

// Methods
const handleVisibilityChange = (visible) => {
  if (!visible) {
    closeSidebar();
  }
};

const hideSidebar = () => {
  uiStore.clearActiveBoardListIndex();
};

const openEditListSidebar = () => {
  saving.value = false;
  const currentList = board.value?.lists?.[activeBoardListIndex.value] || {};
  list.value = {
    name: '',
    games: [],
    sortBy: null,
    vertical: false,
    showGameCount: false,
    smallCover: false,
    hideCover: false,
    hideTitle: false,
    hideTags: false,
    hideRibbon: false,
    hideNotes: false,
    hidePlatforms: false,
    hideProgress: false,
    ranked: false,
    ...currentList,
  };
};

const closeSidebar = () => {
  uiStore.clearActiveBoardListIndex();
};

const confirmDeleteList = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this list?');
  if (confirmed) {
    await deleteList();
  }
};

const deleteList = async () => {
  if (activeBoardListIndex.value === null) return;

  const boardToUpdate = { ...board.value };
  boardToUpdate.lists = [...boardToUpdate.lists];
  boardToUpdate.lists.splice(activeBoardListIndex.value, 1);

  const payload = {
    ...boardToUpdate,
    lastUpdated: Date.now(),
  };

  boardsStore.setGameBoard(payload);

  try {
    await boardsStore.saveBoard();
    showToast('List deleted', 'success');
    closeSidebar();
  } catch (e) {
    saving.value = false;
    showToast('There was an error deleting list', 'danger');
  }
};

const saveList = async () => {
  if (activeBoardListIndex.value === null) return;

  saving.value = true;

  const boardToUpdate = { ...board.value };
  boardToUpdate.lists = [...boardToUpdate.lists];
  boardToUpdate.lists[activeBoardListIndex.value] = { ...list.value };

  const payload = {
    ...boardToUpdate,
    lastUpdated: Date.now(),
  };

  boardsStore.setGameBoard(payload);

  try {
    await boardsStore.saveBoard();
    closeSidebar();
  } catch (e) {
    saving.value = false;
    showToast('There was an error saving list settings', 'danger');
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
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'edit-list-modal') {
        // Toggle handled by visible prop
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

<style scoped>

</style>
