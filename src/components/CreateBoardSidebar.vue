<template lang="html">
  <AppSidebar
    id="create-board-sidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @hidden="handleHidden"
  >
    <template #header>
      <SidebarHeader
        @hide="hideSidebar"
        title="Create board"
      />
    </template>

      <form
        class="p-3"
        @submit.prevent="createBoard"
      >
        <div class="mb-3">
          <label for="boardName" class="form-label">Board name:</label>
          <input
            id="boardName"
            type="text"
            v-model.trim="board.name"
            class="form-control"
            autofocus
            required
          />
        </div>

        <p>Board type:</p>
        <div class="btn-group mb-2" role="group">
          <button
            v-for="{ text, value } in BOARD_TYPES"
            :key="value"
            type="button"
            class="btn"
            :class="value === board.type ? 'btn-primary' : 'btn-light'"
            @click="board.type = value"
          >
            {{ text }}
          </button>
        </div>

        <MiniBoard
          class="mb-2"
          :board="sampleBoardWithRandomizedGames"
          no-link
        />

        <div
          v-if="board.type === BOARD_TYPE_STANDARD"
          class="form-check form-switch mb-3"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="board.ranked"
            id="rankedSwitch"
          />
          <label class="form-check-label" for="rankedSwitch">
            Ranked
          </label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="board.isPublic"
            id="isPublicSwitch"
          />
          <label class="form-check-label" for="isPublicSwitch">
            Public
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary mt-3"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>Create board</span>
        </button>
      </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  BOARD_TYPES,
  BOARD_TYPE_KANBAN,
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,
  DEFAULT_BOARD_KANBAN,
  DEFAULT_BOARD_STANDARD,
  DEFAULT_BOARD_TIER,
} from '@/constants';
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Reactive state
const board = ref({});
const saving = ref(false);
const selectedTemplate = ref(null);
const visible = ref(false);

// Store state and getters
const user = computed(() => store.state.user);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);

// Computed properties
const sampleBoard = computed(() => {
  if (board.value.type === BOARD_TYPE_KANBAN) return DEFAULT_BOARD_KANBAN;
  if (board.value.type === BOARD_TYPE_TIER) return DEFAULT_BOARD_TIER;
  if (board.value.type === BOARD_TYPE_STANDARD) return DEFAULT_BOARD_STANDARD;
  return DEFAULT_BOARD_KANBAN;
});

const sampleBoardWithRandomizedGames = computed(() => {
  const randomizedListWithGames = sampleBoard.value?.lists?.map((list) => ({
    ...list,
    games: Array.from({length: Math.floor(Math.random() * 5) + 2 }, () => ''),
  }));

  return {
    ...sampleBoard.value,
    lists: board.value.type === BOARD_TYPE_TIER
      ? DEFAULT_BOARD_TIER.lists
      : randomizedListWithGames,
  };
});

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const handleHidden = () => {
  saving.value = false;
  visible.value = false;
};

const hideSidebar = () => {
  visible.value = false;
};

const createBoard = async () => {
  try {
    saving.value = true;

    const dateCreated = Date.now();

    const payload = {
      ...sampleBoard.value,
      ...board.value,
      dateCreated,
      lastUpdated: dateCreated,
      lists: sampleBoard.value.lists.map((list) => ({ ...list, games: [] })),
      owner: user.value.uid,
    };

    console.log('payload', payload);

    const { id } = await store.dispatch('CREATE_BOARD', payload);

    router.push({ name: 'board', params: { id } });
  } catch (e) {
    //
  }
};

// Lifecycle hooks
onMounted(() => {
  board.value = {
    ...sampleBoard.value,
    type: BOARD_TYPE_KANBAN,
  };
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'create-board-sidebar') {
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
