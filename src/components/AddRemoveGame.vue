<template lang="html">
  <b-sidebar
    id="addGame"
    no-header
    right
    :visible="Boolean(gameId)"
    backdrop
    shadow
    @hidden="hidden"
  >
    <template #default>
      <div class="p-2 bg-white">
        <b-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
          <b-img
            :src="coverUrl"
            fluid
            rounded
          />
        </b-link>

        <template v-if="user">
          <h4 class="my-3 text-center">Add to list:</h4>

          <div
            v-for="board in formattedBoards"
            :key="board.id"
            class="p-2 bg-white mb-2"
          >
            <header class="mb-2 d-flex align-items-center">
              <b-avatar
                rounded
                :class="['board-thumbnail mr-2', { 'bg-dark' : !board.backgroundColor }]"
                :title="board.name"
                text=" "
                size="32"
                :style="`
                  background-image: url(${board.backgroundUrl ? board.backgroundUrl : ''});
                  background-color: ${board.backgroundColor ? board.backgroundColor : ''}
                  `"
                :to="{ name: 'board', params: { id: board.id } }"
              />

              {{ board.name }}
            </header>

            <b-button
              v-for="(list, listIndex) in board.lists"
              :key="`${board.id}-${list.name}`"
              :variant="isGameInList({ list, gameId }) ? 'success' : 'light'"
              block
              clas
              size="sm"
              @click.stop="handleClick({ list, listIndex, board })"
            >
              {{ list.name }}

              <b-badge variant="light" class="mr-2">
                {{ list.games.length }}
              </b-badge>

              <i :class="`fa-solid ${isGameInList({ list, gameId }) ? 'fa-minus' : 'fa-plus' }`" />
            </b-button>
          </div>
        </template>

        <b-button
          v-else
          block
          :to="{ name: 'auth' }"
          variant="primary"
        >
          Add to list
        </b-button>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      expandedBoard: null,
      gameId: null,
    }
  },

  mounted() {
    this.$bus.$on('ADD_GAME', this.setGame);
  },

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

    coverUrl() {
      return getGameCoverUrl(this.game);
    },
  },

  methods: {
    isGameInList({ list, gameId }) {
      return list.games.includes(Number(gameId));
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
    },

    setGame(gameId) {
      this.gameId = gameId;
    },

    hidden() {
      this.gameId = null;
      this.expandedBoard = null;
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
  .board-thumbnail {
    background-size: cover;
    background-position: center;
  }
</style>
