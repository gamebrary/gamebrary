<template lang="html">
  <b-modal
    id="addRemoveGameModal"
    hide-footer
    centered
    scrollable
    size="sm"
  >
    <b-form-input
      v-if="boards.length > 10"
      v-model.trim="searchText"
      size="sm"
      placeholder="Search boards"
    />

    <div
      v-for="board in filteredBoards"
      :key="board.id"
    >
      <h4>{{ board.name }}</h4>

      <div
        v-for="(list, listIndex) in board.lists"
        class="d-flex mb-1"
        :key="listIndex"
        @click="handleClick({ list, listIndex, board })"
      >
        <small class="mr-auto">{{ list.name }}</small>
        <b-button
          v-if="isGameInList({ list })"
          variant="danger"
        >
          <i class="fa fa-trash" aria-hidden="true" />
        </b-button>

        <b-button
          v-else
        >
          <i class="fa fa-plus" aria-hidden="true" />
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      searchText: '',
    }
  },

  computed: {
    ...mapState(['games', 'boards', 'wallpapers']),

    filteredBoards() {
      return this.boards
        .filter(({ name }) => name.toLowerCase().includes(this.searchText.toLowerCase()));
    },

    game() {
      return this.games[this.gameId] || {};
    },

    gameId() {
      return this.$route.params.id
    },
  },

  methods: {
    isGameInList({ list }) {
      return list.games?.includes(Number(this.gameId));
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
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

    async removeGame({ listIndex, boardId }) {
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];
      const gameIndex = board.lists[listIndex].games.indexOf(this.gameId);

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
