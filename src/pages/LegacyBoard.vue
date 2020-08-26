<template lang="html">
  <div v-if="loaded" class="board" :class="{ dragging }" >
    <board-placeholder v-if="loading" />

    <list
      v-for="(list, listIndex) in gameLists[platform.code]"
      v-if="list && !loading"
      :name="list.name"
      :game-list="list.games"
      :list-index="listIndex"
      :key="`${list.name}-${listIndex}`"
      @dragEnd="dragEnd"
    />

    <add-list />
    <game-modal />
  </div>
</template>

<script>
import BoardPlaceholder from '@/components/LegacyBoard/LegacyBoardPlaceholder';
import AddList from '@/components/LegacyBoard/LegacyAddList';
import GameModal from '@/components/LegacyBoard/LegacyGameModal';
import List from '@/components/LegacyBoard/LegacyList';
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
      draggingId: null,
      loading: true,
      gameData: null,
      gameDetailListIndex: null,
      queryLimit: 500,
    };
  },

  computed: {
    ...mapState(['user', 'gameLists', 'platform', 'games', 'dragging']),

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
    this.load();
  },

  methods: {
    load() {
      if (this.platform) {
        this.loadLegacyBoard();
      } else {
        this.$router.push({ name: 'platforms' });
      }
    },

    dragEnd() {
      this.draggingId = null;
      this.updateLists();
    },

    async updateLists() {
      await this.$store.dispatch('SAVE_LIST_LEGACY', this.gameLists)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
        });

      this.$bvToast.toast('List saved', {
        title: 'Success',
        variant: 'success',
      });
    },

    loadLegacyBoard() {
      const flattenedList = this.list ? this.list.map(({ games }) => games).flat() : [];

      const hasLists = this.list && this.list.length;

      if (!hasLists && flattenedList.length === 0) {
        this.$bvModal.show('add-list');
      }

      const dedupedList = Array.from(new Set(flattenedList));

      return dedupedList.length > this.queryLimit
        ? this.loadGamesInChunks(dedupedList)
        : this.loadGames(dedupedList);
    },

    loadGames(gameList) {
      if (gameList && gameList.length > 0) {
        this.loading = true;

        this.$store
          .dispatch('LOAD_GAMES_LEGACY', gameList.toString())
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
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
