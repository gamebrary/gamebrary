<!-- TODO: Add transparency setting here -->
<!-- TODO: fix Lists will be merged into a single list. -->
<!-- TODO: allow to upload and set wallpaper from here -->
<template lang="html">
  <AppSidebar
    id="edit-board-sidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit board" />
    </template>

    <form @submit.stop.prevent="saveBoard" class="p-3">
      <AppSidebar
        id="select-board-wallpaper"
        :visible="wallpaperSidebarVisible"
        :placement="sidebarRightProps?.placement || 'end'"
        :bg-variant="sidebarRightProps?.bgVariant"
        :text-variant="sidebarRightProps?.textVariant"
        @update:visible="handleWallpaperVisibilityChange"
      >
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
          <input
            id="name"
            type="text"
            v-model="board.name"
            class="form-control"
            required
          />
        </div>

        <p>Board type:</p>

        <div class="btn-group mb-3" role="group">
          <button
            v-for="{ text, value } in $options.BOARD_TYPES"
            :key="value"
            type="button"
            class="btn"
            :class="value === board.type ? 'btn-dark' : 'btn-light'"
            @click="board.type = value"
          >
            {{ text }}
          </button>
        </div>

        <div v-if="needsFlattening" class="alert alert-warning" role="alert">
          Lists will be merged into a single list.
        </div>

        <MiniBoard
          class="mb-3"
          :board="previewBoard"
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

        <div class="form-check form-switch mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="board.darkTheme"
            id="darkThemeSwitch"
          />
          <label class="form-check-label" for="darkThemeSwitch">
            Dark theme
          </label>
        </div>

        <div class="d-flex justify-content-between mb-3">
          <div class="form-check form-switch">
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

          <a
            v-if="board.isPublic"
            class="link-primary float-end"
            target="_blank"
            :href="`https://gamebrary.com/b/${board.id}`"
          >
            Open board
          </a>
        </div>

        <div class="d-flex align-items-start">
          <input
            type="color"
            v-model="board.backgroundColor"
            class="form-control form-control-color mb-3"
            style="width: 40px; height: 40px; cursor: pointer;"
            title="Background color"
          />

          <button
            v-if="board.backgroundColor"
            type="button"
            class="btn btn-light ms-2"
            @click="board.backgroundColor = null"
          >
            <i class="fas fa-close" aria-hidden />
          </button>

          <span class="mt-2 ms-2">Background color</span>
        </div>

        <div class="d-flex align-items-center mb-3">
          <button
            type="button"
            class="btn btn-primary me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#select-board-wallpaper"
          >
            <i class="fa fa-image" aria-hidden="true"></i>
          </button>

          <button
            v-if="board.backgroundUrl"
            type="button"
            class="btn btn-light me-2"
            @click="board.backgroundUrl = null"
          >
            <i class="fas fa-close" aria-hidden />
          </button>

          Background image
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>{{ $t('global.save') }}</span>
        </button>

        <button
          type="button"
          class="btn btn-outline-danger float-end"
          @click="confirmDeleteBoard"
        >
          {{ $t('board.settings.deleteBoard') }}
        </button>
      </form>
  </AppSidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
import AppSidebar from '@/components/Sidebar';
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  BOARD_TYPES,
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_GRID,
  LIST_SORT_OPTIONS,

  components: {
    AppSidebar,
    WallpapersList,
    UploadWallpaperButton,
    MiniBoard,
    SidebarHeader,
  },

  data() {
    return {
      board: {},
      loading: false,
      saving: false,
      lists: [],
      visible: false,
      wallpaperSidebarVisible: false,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme', 'sidebarRightProps']),

    boardId() {
      return this.$route?.params?.id;
    },

    needsFlattening() {
      const listCount = this.board?.lists?.length || 0;

      if (!listCount) return

      return [BOARD_TYPE_STANDARD, BOARD_TYPE_GRID].includes(this.board.type);
    },

    mergedGamesList() {
      return [...new Set(this.board?.lists?.map(({ games }) => games)?.flat())];
    },

    previewBoard() {
      return this.needsFlattening
        ? this.standardPreviewBoard
        : this.board;
    },

    standardPreviewBoard() {
      return {
        ...this.board,
        lists: [{ name: '', games: this.mergedGamesList }],
      }
    },
  },

  watch: {
    boardId(id) {
      if (id) this.loadBoard();
    },
  },

  mounted() {
    if (this.boardId) this.loadBoard();
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'edit-board-sidebar') {
          this.visible = !this.visible;
        } else if (id === 'select-board-wallpaper') {
          this.wallpaperSidebarVisible = !this.wallpaperSidebarVisible;
        }
      });
    }
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('bv::toggle::collapse');
    }
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    handleWallpaperVisibilityChange(visible) {
      this.wallpaperSidebarVisible = visible;
    },

    hideSidebar() {
      this.visible = false;
    },

    hideWallpaperSidebar() {
      this.wallpaperSidebarVisible = false;
    },
    async loadBoard() {
      if (!this.boardId) {
        return;
      }

      try {
        this.loading = true;

        await this.$store.dispatch('LOAD_WALLPAPERS');
        const board = await this.$store.dispatch('LOAD_BOARD', this.boardId);

        this.board = {
          type: BOARD_TYPE_KANBAN,
          ...board,
        };

        this.lists = JSON.parse(JSON.stringify(this.board.lists || []));
      } catch (e) {
        console.error('Error loading board:', e);
      } finally {
        this.loading = false;
      }
    },

    setListSorting(index, value) {
      this.lists[index].sortOrder = value;
      this.$forceUpdate();
    },

    setListView(index, value) {
      this.lists[index].view = value;
      this.$forceUpdate();
    },

    async confirmDeleteBoard() {
      const confirmed = window.confirm('Are you sure you want to delete this board?');
      if (confirmed) {
        await this.deleteBoard();
      }
    },

    async deleteBoard() {
      try {
        this.saving = true;

        await this.$store.dispatch('DELETE_BOARD', this.boardId);
        this.showToast('Board deleted', 'success');
        this.$router.push({ name: 'boards' });
      } catch (e) {
        this.showToast('There was an error deleting board', 'danger');
      } finally {
        this.saving = false;
      }
    },

    selectWallpaper(wallpaper) {
      this.board.backgroundUrl = wallpaper;
      this.hideWallpaperSidebar();
    },

    async saveBoard() {
      try {
        this.saving = true;

        if (this.needsFlattening) {
          const payload = {
            ...this.board,
            lastUpdated: Date.now(),
            lists: [{ name: '', games: this.mergedGamesList }],
          };

          this.$store.commit('SET_ACTIVE_BOARD', payload);
        } else {
          this.$store.commit('SET_ACTIVE_BOARD', {
            ...this.board,
            lastUpdated: Date.now(),
          });
        }

        await this.$store.dispatch('SAVE_BOARD');
        this.showToast('Board saved', 'success');
        this.hideSidebar();
      } catch (e) {
        this.showToast('There was an error saving board', 'danger');
      } finally {
        this.saving = false;
      }
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
