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

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    AppSidebar,
    MiniBoard,
    SidebarHeader,
  },

  data() {
    return {
      selectedBoard: null,
      visible: false,
    }
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme', 'sidebarRightProps']),
  },

  mounted() {
    // Listen for sidebar toggle events
    this.$root.$on('bv::toggle::collapse', (id) => {
      if (id === 'addRemoveGameSidebar') {
        this.visible = !this.visible;
      }
    });
  },

  beforeUnmount() {
    this.$root.$off('bv::toggle::collapse');
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


    isGameInList({ list }) {
      return list.games?.includes(Number(this.game?.id));
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url?.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaper?.url ? decodeURI(wallpaper.url) : '';
    },

    handleClick({ list, listIndex, board }) {
      if (this.isGameInList({ list, gameId: this.game.id })) {
        this.removeGame({ listIndex, boardId: board.id, list });
      } else {
        this.addGame({ list, listIndex, boardId: board.id });
      }
    },

    async addGame({ list, listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];

      board.lists[listIndex].games.push(this.game.id);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        this.showToast(`Added "${this.game.name}" to ${list.name || 'list'}`, 'success');
      } catch (e) {
        this.showToast(`Error adding "${this.game.name}"`, 'danger');
      }
    },

    async removeGame({ listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board.lists[listIndex].games.indexOf(this.game?.id);

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        this.showToast(`Removed "${this.game.name}" from list`, 'success');
      } catch (e) {
        this.showToast(`Error removing "${this.game.name}"`, 'danger');
      }
    },
  },
};
</script>
