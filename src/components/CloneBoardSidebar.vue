<template lang="html">
  <AppSidebar
    id="clone-board-sidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="setBoardName"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Clone board" />
    </template>

      <form @submit.prevent="cloneBoard" class="px-3">
        <div class="mb-3">
          <label for="boardName" class="form-label">Board name:</label>
          <input
            id="boardName"
            type="text"
            v-model.trim="boardName"
            class="form-control"
            autofocus
            required
          />
        </div>

        <MiniBoard
          class="mb-2"
          :board="board"
          no-link
        />

        <button
          type="submit"
          class="btn"
          :class="darkTheme ? 'btn-secondary' : 'btn-primary'"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>Clone board</span>
        </button>
      </form>
  </AppSidebar>
</template>

<script>
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState, mapGetters } from 'vuex';
import { BOARD_TYPE_KANBAN } from '@/constants';

export default {
  data() {
    return {
      boardName: '',
      saving: false,
      visible: false,
    }
  },

  components: {
    AppSidebar,
    SidebarHeader,
    MiniBoard,
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    payload() {
      const dateCreated = Date.now();

      const isBoardOwner = this.board.owner === this.user.uid;

      const backgroundUrl = isBoardOwner
        ? this.board.backgroundUrl
        : null;

      return {
        type: this.board.type || BOARD_TYPE_KANBAN,
        lists: this.board.lists,
        ranked: this.board.ranked || false,
        backgroundUrl: backgroundUrl || null,
        backgroundColor: this.board?.backgroundColor || null,
        lastUpdated: this.board.lastUpdated || dateCreated,
        darkTheme: this.board.darkTheme || false,
        dateCreated: this.board.dateCreated || dateCreated,
        originalOwnerId: this.board.owner,
        isPublic: false,
        dateCreated,
        lastUpdated: dateCreated,
        originalBoardId: this.board.id,
        originalDateCreated: this.board.dateCreated || dateCreated,
        owner: this.user.uid,
        name: this.boardName,
      }
    },
  },

  mounted() {
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'clone-board-sidebar') {
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

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    hideSidebar() {
      this.visible = false;
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

    setBoardName() {
      this.boardName = this.board.name || '';
    },

    async cloneBoard() {
      try {
        this.saving = true;

        const { id } = await this.$store.dispatch('CREATE_BOARD', this.payload);
        this.showToast('Board cloned', 'success');
        this.saving = false;
        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
