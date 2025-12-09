<template lang="html">
  <AppSidebar
    id="wallpaper-details-sidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @hidden="closeSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Filter search results" />
    </template>

    <div class="px-3">
      <a :href="wallpaperUrl" target="_blank">
        <img
          v-if="wallpaperUrl"
          :src="wallpaperUrl"
          class="mw-100 rounded mb-2"
          alt="Wallpaper"
        />
      </a>

      <div class="d-flex align-items-center justify-content-between pb-2">
        <a :href="wallpaperUrl" target="_blank" class="text-truncate">
          {{ activeWallpaper.name }}
        </a>

        <button
          type="button"
          class="btn btn-danger ms-2"
          data-bs-toggle="modal"
          data-bs-target="#deleteConfirm"
          :title="'Delete wallpaper'"
        >
          <i class="fa fa-trash" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        class="btn"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
        data-bs-toggle="collapse"
        data-bs-target="#boards-list"
        :aria-expanded="boardsListExpanded"
        aria-controls="boards-list"
      >
        Set as wallpaper
      </button>
    </div>

    <div class="collapse" id="boards-list">
      <div
        style="position: sticky; top: 0; z-index: 3;"
        :class="darkTheme ? 'bg-dark' : 'bg-light'"
        class="pt-3 pb-1"
      >
        <div class="alert alert-success" role="alert">
          Select a board to apply wallpaper
        </div>
      </div>

      <MiniBoard
        v-for="board in formattedBoards"
        :key="board.id"
        :board="board"
        no-link
        @click="setAsBoardWallpaper(board)"
      />
    </div>

    <div
      class="modal fade"
      id="deleteConfirm"
      tabindex="-1"
      aria-labelledby="deleteConfirmLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmLabel">Are you sure?</h5>
            <button type="button" class="btn-close" :class="darkTheme ? 'btn-close-white' : ''" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Wallpaper will be permanently removed</p>

            <div v-if="boardsWithWallpaper.length" class="alert alert-warning" role="alert">
              This wallpaper is being used by {{ boardsWithWallpaper.length }} boards.
            </div>

            <button type="button" class="btn btn-danger" @click="deleteFile(activeWallpaper)">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppSidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';

export default {
  data() {
    return {
      saving: false,
      deleting: false,
      boardsListExpanded: false,
    };
  },

  components: {
    AppSidebar,
    MiniBoard,
    SidebarHeader,
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'activeWallpaper']),
    ...mapGetters(['darkTheme', 'sidebarRightProps', 'buttonProps']),

    formattedBoards() {
      return this.boards.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
    },

    wallpaperUrl() {
      return this.activeWallpaper?.url;
    },

    boardsWithWallpaper() {
      return this.boards.filter(({ backgroundUrl }) => backgroundUrl && backgroundUrl === this.activeWallpaper?.fullPath) || [];
    },

    visible() {
      return Boolean(this.activeWallpaper?.fullPath);
    },
  },

  mounted() {
    // Initialize collapse
    const collapseElement = document.getElementById('boards-list');
    if (collapseElement) {
      collapseElement.addEventListener('shown.bs.collapse', () => {
        this.boardsListExpanded = true;
      });
      collapseElement.addEventListener('hidden.bs.collapse', () => {
        this.boardsListExpanded = false;
      });
    }
    // Initialize tooltips
    this.$nextTick(() => {
      const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  },

  methods: {
    handleVisibilityChange(visible) {
      if (!visible) {
        this.closeSidebar();
      }
    },

    hideSidebar() {
      this.$store.commit('CLEAR_ACTIVE_WALLPAPER');
    },

    closeSidebar() {
      this.$store.commit('CLEAR_ACTIVE_WALLPAPER');
      this.saving = false;
      this.deleting = false;
    },

    getWallpaperUrl(url) {
      if (!url) return null;
      if (url?.includes('igdb.com')) return url;

      return this.wallpapers?.find(({ ref }) => ref === url)?.url;
    },

    async deleteFile(file) {
      this.deleting = true;

      await this.$store.dispatch('DELETE_WALLPAPER', file)
        .catch(() => {
          this.showToast('There was an error deleting wallpaper', 'danger');
        });

      const modalElement = document.getElementById('deleteConfirm');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
      this.hideSidebar();
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

    async setAsBoardWallpaper(board) {
      try {
        this.saving = true;

        this.$store.commit('SET_ACTIVE_BOARD', { ...board, backgroundUrl: this.activeWallpaper.fullPath });

        await this.$store.dispatch('SAVE_BOARD');
        this.$store.commit('CLEAR_ACTIVE_WALLPAPER');

        this.$router.push({ name: 'board', params: { id: board.id } });
      } catch (e) {
        this.saving = false;
      }
    },
  },
};
</script>
