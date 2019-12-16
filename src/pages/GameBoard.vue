<template lang="html">
  <div v-if="loaded" class="game-board" :class="{ dragging }" >
    <game-board-placeholder v-if="loading" />

    <list
      v-for="(list, listIndex) in gameLists[platform.code]"
      v-if="list && !loading"
      :name="list.name"
      :game-list="list.games"
      :list-index="listIndex"
      :key="`${list.name}-${listIndex}`"
      @dragEnd="dragEnd"
    />

    <list-add-modal ref="listAddModal" />
    <game-modal />
    <game-tags-modal />
  </div>
</template>

<script>
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import ListAddModal from '@/components/GameBoard/ListAddModal';
import GameTagsModal from '@/components/GameBoard/GameTagsModal';
import GameModal from '@/components/GameBoard/GameModal';
import List from '@/components/Lists/List';
import { chunk } from 'lodash';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    List,
    GameBoardPlaceholder,
    ListAddModal,
    GameTagsModal,
    GameModal,
  },

  data() {
    return {
      draggingId: null,
      loading: false,
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
    if (!this.platform) {
      this.$router.push({ name: 'platforms' });
      return;
    }

    this.load();
  },

  methods: {
    dragEnd() {
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

      const hasLists = this.list && this.list.length;

      if (!hasLists && flattenedList.length === 0) {
        this.$refs.listAddModal.$refs.addList.click();
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

  @media($small) {
    &:not(.dragging) {
      scroll-snap-type: mandatory;
      scroll-snap-points-x: repeat(300px);
      scroll-snap-type: x mandatory;
      scroll-padding: $gp;

      .list {
        scroll-snap-align: start;
      }
    }
  }
}

.list-placeholder {
  opacity: 0.25;
}
</style>
