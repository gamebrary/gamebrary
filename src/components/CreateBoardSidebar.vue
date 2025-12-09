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
            v-for="{ text, value } in $options.BOARD_TYPES"
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
          v-if="board.type === $options.BOARD_TYPE_STANDARD"
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

<script>
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
import AppSidebar from '@/components/Sidebar';
import { mapState, mapGetters } from 'vuex';

export default {
  BOARD_TYPES,
  BOARD_TYPE_TIER,
  BOARD_TYPE_STANDARD,
  DEFAULT_BOARD_TIER,

  components: {
    AppSidebar,
    MiniBoard,
    SidebarHeader,
  },

  data() {
    return {
      board: {},
      saving: false,
      selectedTemplate: null,
      visible: false,
    };
  },

  mounted() {
    this.board = {
      ...this.sampleBoard,
      type: BOARD_TYPE_KANBAN,
    }
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'create-board-sidebar') {
          this.visible = !this.visible;
        }
      });
    }
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('bv::toggle::collapse');
    }
  },

  computed: {
		...mapState(['user']),
		...mapGetters(['sidebarRightProps']),

    sampleBoard() {
      if (this.board.type === BOARD_TYPE_KANBAN) return DEFAULT_BOARD_KANBAN;
      if (this.board.type === BOARD_TYPE_TIER) return DEFAULT_BOARD_TIER;
      if (this.board.type === BOARD_TYPE_STANDARD) return DEFAULT_BOARD_STANDARD;

      return DEFAULT_BOARD_KANBAN;
    },

    sampleBoardWithRandomizedGames() {
      const randomizedListWithGames = this.sampleBoard?.lists?.map((list) => ({
        ...list,
        games: list.games = Array.from({length: Math.floor(Math.random() * 5) + 2 }, () => ''),
      }));

      return {
        ...this.sampleBoard,
        lists: this.board.type === BOARD_TYPE_TIER
          ? DEFAULT_BOARD_TIER.lists
          : randomizedListWithGames,
      }
    }
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    handleHidden() {
      this.saving = false;
      this.visible = false;
    },

    hideSidebar() {
      this.visible = false;
    },

    async createBoard() {
      try {
        this.saving = true;

        const dateCreated = Date.now();

        const payload = {
          ...this.sampleBoard,
          ...this.board,
          dateCreated,
          lastUpdated: dateCreated,
          lists: this.sampleBoard.lists.map((list) => ({ ...list, games: [] })),
          owner: this.user.uid,
        }

        console.log('payload', payload)

        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        //
      }
    },
  },
};
</script>
