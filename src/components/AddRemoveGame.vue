<template lang="html">
  <!-- TODO: use lazy prop for dropdown -->
  <b-dropdown
    id="dropdown-grouped"
    variant="light"
    right
    no-caret
  >
    <template #button-content>
      <i class="fa-solid fa-plus fa-fw" />
    </template>

    <p class=" mx-2 my-0 text-center text-muted">
      Add to list
    </p>

    <b-dropdown-divider />

    <pre>{{ gameId }}</pre>

    <section
      v-for="board in formattedBoards"
      :key="board.id"
      class="p-2 bg-white mb-2 field"
    >
      <div class="text-center">
        <b-avatar
          rounded
          :class="['board-thumbnail', { 'bg-dark' : !board.backgroundColor }]"
          :title="board.name"
          text=" "
          size="32"
          :style="`
            background-image: url(${board.backgroundUrl ? board.backgroundUrl : ''});
            background-color: ${board.backgroundColor ? board.backgroundColor : ''}
            `"
          :to="{ name: 'board', params: { id: board.id } }"
        />

        <br />

        <span class="text-muted">{{ board.name }}</span>
      </div>

      <section
        v-for="(list, listIndex) in board.lists"
        :key="`${board.id}-${list.name}`"
        class="d-flex align-items-center justify-content-between mb-2"
      >
        <b-badge variant="light" class="mr-2">
          {{ list.games.length }}
        </b-badge>

        {{ list.name }}

        <b-form-checkbox
          id="checkbox-1"
          name="checkbox-1"
          :checked="isGameInList({ list })"
          switch
          @change="handleClick({ list, listIndex, board })"
          unchecked-value="not_accepted"
        />
      </section>
    </section>
    <b-dropdown-divider />
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {

  computed: {
    ...mapState(['games', 'boards', 'wallpapers', 'user']),

    // TODO: handle this at action/mutation level OR use getter at least
    formattedBoards() {
      return this.boards
        .map((board) => {
          const backgroundUrl = this.getWallpaperUrl(board.backgroundUrl);

          return {
            ...board,
            backgroundUrl,
          };
        });
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
      console.log('list', list);
      console.log('gameId', this.gameId);
      return list.games.includes(Number(this.gameId));
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
    },

    handleClick({ list, listIndex, board }) {
      console.log('list', list);
      console.log('listIndex', listIndex);
      console.log('board', board);
      if (this.isGameInList({ list, gameId: this.game.id })) {
        console.log('removeGame');
        this.removeGame({ listIndex, boardId: board.id, list });
      } else {
        console.log('addGame');
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
  .board-thumbnail {
    background-size: cover;
    background-position: center;
  }
</style>
