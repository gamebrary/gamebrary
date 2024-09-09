<template lang="html">
  <b-modal
    id="addRemoveGameModal"
    hide-footer
    centered
    scrollable
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="`Add or remove ${game.name} to list`"
        @close="close"
      />
    </template>

    <b-list-group>
      <b-list-group-item v-for="board in boards" :key="board.id">
        <div
          class="cursor-pointer d-flex align-items-center"
          @click="selectedBoard = board.id"
        >
          <MiniBoard
            class="cursor-pointer"
            :board="board"
            thumbnail
          />

          <h3 class="mx-2">{{ board.name }}</h3>
        </div>

        <b-collapse :visible="selectedBoard === board.id" class="mt-2">
          <b-list-group>
            <b-list-group-item
              v-for="(list, listIndex) in board.lists"
              :key="listIndex"
              class="d-flex justify-content-between align-items-center"
            >
              {{ list.name || '[Unnamed]' }}

              <b-button
                :variant="isGameInList({ list }) ? 'danger' : 'success'"
                @click="handleClick({ list, listIndex, board })"
              >
                {{ isGameInList({ list }) ? 'Remove from list' : 'Add to list' }}
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
  </b-modal>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
  },

  data() {
    return {
      selectedBoard: null,
    }
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme']),
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
      } catch (e) {
        //
      }
    },

    async removeGame({ listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board.lists[listIndex].games.indexOf(this.game?.id);

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },
  },
};
</script>
