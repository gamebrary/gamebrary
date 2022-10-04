<template lang="html">
  <b-dropdown
    no-caret
    toggle-class="p-0 px-2 mt-n2"
    size="sm"
  >
    <template #button-content>
      <i class="fa fa-plus small pr-1" aria-hidden="true" />
      <small>Add to list</small>
    </template>

    <div class="m-2 d-flex">
      <b-form-input
        v-if="boards.length > 10"
        v-model.trim="searchText"
        size="sm"
        placeholder="Search boards"
      />
    </div>

    <b-dropdown-divider />

    <div
      v-for="board in filteredBoards"
      :key="board.id"
      class="board p-2 bg-white mb-2"
    >
      <strong class="small">{{ board.name }}</strong>

      <div
        v-for="(list, listIndex) in board.lists"
        class="d-flex mb-1"
        :key="`${board.id}-${list.name}`"
        @click="handleClick({ list, listIndex, board })"
      >
        <small class="mr-auto">{{ list.name }}</small>
        <b-button
          v-if="isGameInList({ list })"
          size="sm"
        >
          <i class="fa fa-minus" aria-hidden="true" />
        </b-button>

        <b-button
          v-else
          size="sm"
        >
          <i class="fa fa-plus" aria-hidden="true" />
        </b-button>
      </div>
    </div>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      searchText: '',
    }
  },

  computed: {
    ...mapState(['games', 'boards', 'wallpapers']),

    // TODO: handle this at action/mutation level OR use getter at least
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

    coverUrl() {
      return getGameCoverUrl(this.game);
    },
  },

  methods: {
    isGameInList({ list }) {
      return list.games?.includes(Number(this.gameId));
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
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
