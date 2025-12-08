<template lang="html">
  <b-sidebar
    id="addRemoveGameSidebar"
    v-bind="sidebarRightProps"
  >
    <template #default="{ hide }">
      <SidebarHeader
        :title="`Add or remove ${game?.name || 'game'} to list`"
        @hide="hide"
      />

      <div class="px-3 pb-3">
        <b-list-group>
          <b-list-group-item
            v-for="board in boards"
            :key="board.id"
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

            <b-collapse :visible="selectedBoard === board.id" class="mt-2">
              <b-list-group>
                <b-list-group-item
                  v-for="(list, listIndex) in board.lists"
                  :key="listIndex"
                  class="d-flex justify-content-between align-items-center"
                  :class="darkTheme ? 'bg-dark text-light' : 'bg-light'"
                >
                  {{ list.name || '[Unnamed]' }}

                  <b-button
                    :variant="isGameInList({ list }) ? 'danger' : 'success'"
                    size="sm"
                    @click="handleClick({ list, listIndex, board })"
                  >
                    {{ isGameInList({ list }) ? 'Remove' : 'Add' }}
                    <i
                      :class="`fa fa-${isGameInList({ list }) ? 'trash' : 'plus'}`"
                      aria-hidden="true"
                    />
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    SidebarHeader,
  },

  data() {
    return {
      selectedBoard: null,
    }
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme', 'sidebarRightProps']),
  },

  methods: {
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
        this.$bvToast.toast(`Added "${this.game.name}" to ${list.name || 'list'}`, {
          variant: 'success',
        });
      } catch (e) {
        this.$bvToast.toast(`Error adding "${this.game.name}"`, {
          variant: 'danger',
        });
      }
    },

    async removeGame({ listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board.lists[listIndex].games.indexOf(this.game?.id);

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        this.$bvToast.toast(`Removed "${this.game.name}" from list`, {
          variant: 'success',
        });
      } catch (e) {
        this.$bvToast.toast(`Error removing "${this.game.name}"`, {
          variant: 'danger',
        });
      }
    },
  },
};
</script>
