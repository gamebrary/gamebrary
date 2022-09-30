<!-- TODO: add text filtering/search -->
<template lang="html">
  <b-dropdown
    variant="light"
    right
    no-caret
  >
    <template #button-content>
      <i class="fa-solid fa-plus fa-fw" />
    </template>

    <small class="d-block mx-2 my-0 text-center text-muted">
      Add to list
    </small>

    <b-form-input
      v-model.trim="searchText"
      placeholder="Enter your name"
    />

    <pre>{{ searchText }}</pre>

    <b-dropdown-divider />

    <div
      v-for="board in filteredBoards"
      :key="board.id"
      class="board p-2 bg-white mb-2"
    >
      <aside class="d-flex flex-column">
        <b-avatar
          rounded
          :class="['mr-2 mb-2 board-thumbnail', { 'bg-dark' : !board.backgroundColor }]"
          :title="board.name"
          text=" "
          size="80"
          :style="`
            background-image: url(${board.backgroundUrl ? board.backgroundUrl : ''});
            background-color: ${board.backgroundColor ? board.backgroundColor : ''}
            `"
          :to="{ name: 'board', params: { id: board.id } }"
        />

        <small class="text-muted">{{ board.name }}</small>
      </aside>

      <aside class="float-left">
        <b-button
          v-for="(list, listIndex) in board.lists"
          :key="`${board.id}-${list.name}`"
          :variant="isGameInList({ list }) ? 'success' : 'light'"
          @click="handleClick({ list, listIndex, board })"
          block
          size="sm"
        >
          <i
            v-if="isGameInList({ list })"
            class="fa-solid fa-check"
          />

          <small class="text-truncate">
            {{ list.name }}
          </small>
        </b-button>
      </aside>
    </div>
    <b-dropdown-divider />
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
        .filter(({ name }) => name.toLowerCase().includes(this.searchText.toLowerCase()))
        .map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
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
    width: 300px;
    max-width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  .board-thumbnail {
    background-size: cover;
    background-position: center;
  }
</style>
