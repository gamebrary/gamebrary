<template lang="html">
  <div class="board" :class="{ dragging }" >
    <board-placeholder v-if="loading" />

    <template v-else>
      <list
        v-for="(list, listIndex) in board.lists"
        :list="list"
        :listIndex="listIndex"
        :key="list.name"
      />
    </template>

    <add-list />
    <game-modal />
  </div>
</template>

<script>
import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import AddList from '@/components/Board/AddList';
import GameModal from '@/components/Game/GameModal';
import List from '@/components/Lists/List';
import chunk from 'lodash.chunk';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    List,
    BoardPlaceholder,
    AddList,
    GameModal,
  },

  data() {
    return {
      loading: true,
      gameData: null,
      gameDetailListIndex: null,
      queryLimit: 500,
    };
  },

  computed: {
    ...mapState(['user', 'dragging', 'board']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      // TODO: handle loading public board
      if (this.$route.params.id && this.user) {
        this.loadBoard(this.$route.params.id);
      } else {
        this.$router.push({ name: 'dashboard' });
      }
    },

    async loadBoard(id) {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD', id)
        .catch(() => {
          this.$router.replace({ path: '/' });
        });

      this.loadBoardGames();
    },

    loadBoardGames() {
      const { lists } = this.board;

      if (lists.length === 0) {
        this.$bvModal.show('add-list');
      }

      const boardGames = Array.from(new Set(lists.map(({ games }) => games).flat()));

      if (boardGames.length === 0) {
        this.loading = false;

        return boardGames;
      }

      return boardGames.length > this.queryLimit
        ? this.loadGamesInChunks(boardGames)
        : this.loadGames(boardGames);
    },

    async loadGames(gameList) {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD_GAMES', gameList.toString())
        .catch(() => {
          this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
        });

      this.loading = false;
    },

    loadGamesInChunks(gameList) {
      const chunkedGameList = chunk(gameList, this.queryLimit);

      chunkedGameList.forEach((gameListChunk) => {
        this.loadGames(gameListChunk);
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.board {
  user-select: none;
  display: flex;
  align-items: flex-start;
  height: calc(100vh - 58px);
  padding: 0 1rem;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
  display: flex;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
