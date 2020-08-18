<template lang="html">
  <div class="board" :class="{ dragging }" >
    <board-placeholder v-if="loading" />

    <template v-else>
      <pre>{{ board }}</pre>
      <list
        v-for="(list, listIndex) in board.lists"
        v-if="list && !loading"
        :name="list.name"
        :game-list="list.games"
        :list-index="listIndex"
        :key="`${list.name}-${listIndex}`"
        @dragEnd="updateLists"
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
// import chunk from 'lodash.chunk';
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
    ...mapState(['user', 'gameLists', 'platform', 'boards', 'games', 'dragging', 'board']),
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

    async updateLists() {
      await this.$store.dispatch('SAVE_LIST_LEGACY', this.gameLists)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('List saved', {
        title: 'Success',
        variant: 'success',
      });
    },

    async loadBoard(id) {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD', id)
        .catch(() => {
          this.$router.replace({ path: '/' });
        });

      this.loading = false;
      this.loadBoardGames();
    },

    loadBoardGames() {
      const { lists } = this.board;

      if (lists.length === 0) {
        return this.$bvModal.show('add-list');
      }

      const boardGames = lists.length > 0
        ? lists.map(({ games }) => games).flat()
        : [];

      // eslint-disable-next-line
      console.log(boardGames);

      return boardGames;

      // if (!hasLists && flattenedList.length === 0) {
      // }
      //
      // const dedupedList = Array.from(new Set(flattenedList));
      //
      // return dedupedList.length > this.queryLimit
      //   ? this.loadGamesInChunks(dedupedList)
      //   : this.loadGames(dedupedList);
    },

    loadGames(gameList) {
      // eslint-disable-next-line
      console.log(gameList);
      // if (gameList && gameList.length > 0) {
      //   this.loading = true;
      //
      //   this.$store
      //     .dispatch('LOAD_BOARD_GAMES', gameList.toString())
      //     .then(() => {
      //       this.loading = false;
      //     })
      //     .catch(() => {
      //       this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
      //     });
      // }
    },

    loadGamesInChunks(gameList) {
      // eslint-disable-next-line
      console.log(gameList);
      // const chunkedGameList = chunk(gameList, this.queryLimit);
      //
      // chunkedGameList.forEach((gameListChunk) => {
      //   this.loadGames(gameListChunk);
      // });
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
