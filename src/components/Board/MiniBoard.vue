<!-- TODO: highlight game in board when clicked from here -->
<template lang="html">
  <b-card
    class="cursor-pointer overflow-hidden"
    :bg-variant="darkTheme ? 'dark' : 'transparent'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    body-class="p-0"
    content-class="rounded"
  >
    <div
      :style="backgroundSyle"
      class="mini-board"
      :class="{ thumbnail }"
    >
      <header class="text-small px-2 pt-1 d-flex align-items-center justify-content-between">
        <h4
          v-if="!thumbnail"
          :class="{ 'text-white': hasCustomBackground || darkTheme }"
        >
          {{ board.name }}
        </h4>

        <b-badge
          v-if="showPublicIndicator"
          :variant="darkTheme ? 'warning' : 'danger'"
          size="sm"
        >
          Public
        </b-badge>
      </header>

      <TierMiniBoard
        v-if="isTierBoard"
        :board="formattedBoard"
        :gameId="gameId"
      />

      <StandardMiniBoard
        v-else-if="isStandardBoard"
        :board="formattedBoard"
        :gameId="gameId"
      />
      
      <KanbanMiniBoard
        v-else
        :gameId="gameId"
        :board="formattedBoard"
      />

      <!-- TODO: use dynamic component -->
    </div>
  </b-card>
</template>

<script>
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER, IMAGE_SIZE_THUMB } from '@/constants';
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import StandardMiniBoard from '@/components/MiniBoards/StandardMiniBoard';
import KanbanMiniBoard from '@/components/MiniBoards/KanbanMiniBoard';
import TierMiniBoard from '@/components/MiniBoards/TierMiniBoard';

export default {
  props: {
    board: Object,
    gameId: Number,
    thumbnail: Boolean,
  },

  components: {
    StandardMiniBoard,
    KanbanMiniBoard,
    TierMiniBoard,
  },

  data() {
    return {
      backgroundUrl: '',
    };
  },

  watch: {
    'board.backgroundUrl'(newValue, oldValue) {
      if (newValue !== oldValue) this.loadWallpaper();
    },
  },

  computed: {
    ...mapState(['cachedGames']),
    ...mapGetters(['darkTheme']),

    formattedBoard() {
      const formattedLists = this.board?.lists?.map((list) => ({
          games: list.games?.map((game) => {
            const cachedGame = this.cachedGames?.[Number(game)] || {};
            
            return {
              id: cachedGame.id,
              name: cachedGame.name,
              src: getImageUrl(this.cachedGames?.[Number(game)], IMAGE_SIZE_THUMB),
            }
          }),
          name: list.name,
        }));

      const formattedBoard = {
        ...this.board,
        lists: formattedLists,
      }
      
      return formattedBoard;
    },

    hasCustomBackground() {
      return this.board?.backgroundColor || this.board?.backgroundUrl;
    },

    showPublicIndicator() {
      return this.$route.name !== 'home' && this.board?.isPublic;
    },

    isStandardBoard() {
      return this.board?.type === BOARD_TYPE_STANDARD;
    },

    isTierBoard() {
      return this.board?.type === BOARD_TYPE_TIER;
    },

    backgroundSyle() {
      if (this.backgroundUrl) return `background-image: url(${this.backgroundUrl});`
      if (this.board?.backgroundColor) return `background-color: ${this.board.backgroundColor};`;

      return null;
    },
  },

  mounted() {
    this.loadWallpaper();
  },

  methods: {
    async loadWallpaper() {
      if (this.board?.backgroundUrl) {
        this.backgroundUrl = this.board?.backgroundUrl?.includes('igdb')
          ? this.board?.backgroundUrl
          : await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.board?.backgroundUrl);
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$boardHeight: 200px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
  min-width: 300px;
  text-align: left;

  &.thumbnail {
    min-width: auto;
    width: 120px !important;
    height: 80px;
  }
}

.board {
  max-height: $boardHeight;
}

.kanban-list {
  max-height: 152px;
}
</style>
