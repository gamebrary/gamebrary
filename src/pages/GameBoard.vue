<template lang="html">
  <div v-if="loaded" class="game-board" >
    <game-board-placeholder v-if="loading" :id="gameDetailId" />

    <modal
      ref="game"
      large
      @close="closeGame"
    >
      <game
        v-if="gameDetailId"
        slot="content"
        :id="gameDetailId"
        :list-id="gameDetailListIndex"
      />
    </modal>

    <apply-tag />

    <list
      v-for="(list, listIndex) in gameLists[platform.code]"
      v-if="list && !loading"
      :name="list.name"
      :game-list="list.games"
      :list-index="listIndex"
      :key="`${list.name}-${listIndex}`"
      @end="dragEnd"
    />

    <list-add />
  </div>
</template>

<script>
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import ListAdd from '@/components/Lists/ListAdd';
import ApplyTag from '@/components/Tags/ApplyTag';
import Modal from '@/components/Modal';
import List from '@/components/Lists/List';
import Game from '@/pages/Game';
import { chunk } from 'lodash';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    List,
    GameBoardPlaceholder,
    ListAdd,
    ApplyTag,
    Game,
    Modal,
  },

  data() {
    return {
      dragging: false,
      draggingId: null,
      loading: false,
      gameData: null,
      gameDetailListIndex: null,
      gameDetailId: null,
      queryLimit: 500,
    };
  },

  computed: {
    ...mapState(['user', 'gameLists', 'platform', 'games']),

    list() {
      return this.gameLists && this.platform && this.gameLists[this.platform.code]
        ? this.gameLists[this.platform.code]
        : null;
    },

    loaded() {
      return this.user && this.platform;
    },
  },

  mounted() {
    if (!this.platform) {
      this.$router.push({ name: 'platforms' });
      return;
    }

    this.load();
    this.setPageTitle();
    this.$bus.$on('OPEN_GAME', this.openGame);
  },

  beforeDestroy() {
    this.$bus.$off('OPEN_GAME');
  },

  methods: {
    closeGame() {
      this.setPageTitle();
      this.gameDetailId = null;
      this.$store.commit('CLEAR_ACTIVE_GAME');
    },

    setPageTitle() {
      document.title = this.platform ? `${this.platform.name} - Gamebrary` : 'Gamebrary';
    },

    openGame({ id, listId }) {
      this.gameDetailId = id;
      this.gameDetailListIndex = listId;
      this.$refs.game.open();
    },

    dragEnd() {
      this.dragging = false;
      this.draggingId = null;
      this.updateLists();
    },

    updateLists() {
      this.$store
        .dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'List updated' });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    load() {
      const flattenedList = this.list ? this.list.map(({ games }) => games).flat() : [];

      const dedupedList = Array.from(new Set(flattenedList));

      return dedupedList.length > this.queryLimit
        ? this.loadGamesInChunks(dedupedList)
        : this.loadGames(dedupedList);
    },

    loadGames(gameList) {
      if (gameList && gameList.length > 0) {
        this.loading = true;

        this.$store
          .dispatch('LOAD_GAMES', gameList.toString())
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.$bus.$emit('TOAST', { message: 'Error loading games', type: 'error' });
          });
      }
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
@import '~styles/styles';

.game-board {
  user-select: none;
  display: flex;
  align-items: flex-start;
  height: calc(100vh - 48px);
  padding: 0 $gp;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-x: overlay;
  display: flex;
}

.list-placeholder {
  opacity: 0.25;
}
</style>
