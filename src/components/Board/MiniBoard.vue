<template lang="html">
  <b-card
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    body-class="p-0"
    class="overflow-hidden"
    content-class="rounded"
  >
    <router-link
      :to="{ name: 'board', params: { id: board.id } }"
      :event="noLink ? '' : 'click'"
    >
      <div
        :style="backgroundSyle"
        class="mini-board overflow-hidden"
        :class="{ thumbnail }"
      >
        <h4
          v-if="!thumbnail"
          class="px-2 py-2"
          :class="{ 'text-white': hasCustomBackground || darkTheme }"
        >
          {{ board.name }}
        </h4>

        <b-badge
          v-if="showPublicIndicator"
          class="position-absolute m-1"
          style="right: 0; top: 0;"
          :variant="darkTheme ? 'warning' : 'danger'"
          size="sm"
        >
          Public
        </b-badge>

        <component
          :is="miniBoardComponent"
          :board="formattedBoard"
        />
      </div>
    </router-link>
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
    thumbnail: Boolean,
    noLink: Boolean,
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
    ...mapState(['cachedGames', 'game']),
    ...mapGetters(['darkTheme']),

    miniBoardComponent() {
      if (this.board?.type === BOARD_TYPE_TIER) return 'TierMiniBoard';
      if (this.board?.type === BOARD_TYPE_STANDARD) return 'StandardMiniBoard';

      return 'KanbanMiniBoard';
    },

    formattedBoard() {
      const formattedLists = this.board?.lists?.map((list) => ({
        ...list,
        games: list?.games?.map((game) => {
          if (!game) return {};

          const cachedGame = this.cachedGames?.[Number(game)] || {};

          return {
            id: cachedGame.id,
            name: cachedGame.name,
            src: getImageUrl(this.cachedGames?.[Number(game)], IMAGE_SIZE_THUMB, true),
          }
        }),
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
$boardHeight: 240px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
  // max-width: 100%;
  // min-width: 300px;
  text-align: left;

  &.thumbnail {
    min-width: auto;
    width: 120px !important;
    height: 80px;
  }
}

.board {
  max-height: $boardHeight;
  width: 100%;
}

.kanban-list {
  max-height: 152px;
}
</style>
