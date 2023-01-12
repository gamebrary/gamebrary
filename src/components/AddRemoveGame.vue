<template lang="html">
  <b-modal
    id="addRemoveGameModal"
    hide-footer
    centered
    scrollable
    size="sm"
    :header-bg-variant="darkTheme ? 'dark' : 'white'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'white'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="title"
        @close="close"
      >
        <b-button @click="selectedBoard = null">Change board</b-button>
      </modal-header>
    </template>

    <!-- <b-form-input
      v-if="boards.length > 10"
      v-model.trim="searchText"
      size="sm"
      placeholder="Search boards"
    /> -->

    <div v-if="selectedBoard">
      <mini-board
        :board="selectedBoard"
        class="mb-3"
        @click.native="handleSelectedBoardClick"
      />

      <b-list-group>
        <b-list-group-item
          v-for="(list, listIndex) in selectedBoard.lists"
          :key="listIndex"
          class="d-flex justify-content-between align-items-center"
        >
          {{ list.name }}

          <b-button
            :variant="isGameInList({ list }) ? 'danger' : 'success'"
            @click="handleClick({ list, listIndex, board: selectedBoard })"
          >
            <i
              :class="`fa fa-${isGameInList({ list }) ? 'trash' : 'plus'}`"
              aria-hidden="true"
            />
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </div>

    <div v-else class="board-grid contained">
      <mini-board
        v-for="board in boards"
        :key="board.id"
        :board="board"
        @click.native="selectedBoard = board"
      />
    </div>
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
    ...mapState(['games', 'boards', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme']),

    title() {
      return this.selectedBoard
        ? 'Select list'
        : 'Select board'
    },
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

    handleSelectedBoardClick() {
      this.$store.commit('SET_HIGHLIGHTED_GAME', this.game.id)
      this.$router.push({ name: 'board', params: { id: this.selectedBoard.id } });
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
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
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

<style lang="scss" rel="stylesheet/scss" scoped>
  .board {
    width: 180px;
    max-width: 100%;
  }

  .board-thumbnail {
    background-size: cover;
    background-position: center;
  }
</style>
