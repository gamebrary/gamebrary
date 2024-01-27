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
    >
      <header class="text-small px-2 pt-1 d-flex align-items-center justify-content-between">
        <h4 :class="{ 'text-white': hasCustomBackground || darkTheme }">
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

      <template v-if="isTierBoard">
        <div
          class="d-flex mx-2"
          v-for="tier in formattedBoard.lists"
          style="margin-bottom: 4px;"
          :key="tier.id"
        >
          <b-avatar
            :style="`background-color: ${tier.backgroundColor}; border-radius: 4px !important;`"
            text=" "
            size="20"
          />

          <b-avatar
            v-for="(game, index) in tier.games"
            :key="index"
            :variant="gameId && game.id === gameId ? 'danger' : darkTheme ? 'black' : 'light'"
            v-b-tooltip.hover
            :title="game.name"
            text=" "
            square
            :src="coversInMiniBoards ? game.src : null"
            style="margin-left: 4px; border-radius: 4px !important;"
            size="20"
          />
        </div>
      </template>

      <div
        v-else-if="isStandardBoard"
        class="board d-flex rounded overflow-hidden justify-content-center"
      >
        <b-card
          body-class="p-0"
          :bg-variant="darkTheme ? 'black' : 'transparent'"
          :text-variant="darkTheme ? 'light' : 'dark'"
          style="width: 80px"
          class="overflow-hidden align-self-start"
        >
          <template v-if="firstList.games.length">
            <div
              v-for="(game, index) in firstList.games"
              :key="index"
              :class="[darkTheme ? 'border-black bg-dark' : 'border-light bg-white', { 'border-bottom': index !== firstList.games.length - 1 }]"
            >
              <b-avatar
                :style="`border-radius: 4px !important;`"
                text=" "
                :variant="darkTheme ? 'black' : 'light'"
                class="m-1"
                v-b-tooltip.hover
                :title="game.name"
                :src="coversInMiniBoards ? game.src : null"
                size="20"
              />

              <small v-if="board.ranked">{{ index + 1 }}</small>
            </div>
          </template>

          <div
            v-else
            class="rounded overflow-hidden"
            style="height: 22px; width: 60px;"
          />
        </b-card>
      </div>

      <div v-else class="lists d-inline-flex ml-1 rounded overflow-hidden">
        <b-card
          v-for="(list, listIndex) in formattedBoard.lists"
          :key="listIndex"
          body-class="p-0 kanban-list"
          :bg-variant="darkTheme ? 'black' : 'transparent'"
          :text-variant="darkTheme ? 'light' : 'dark'"
          class="overflow-hidden align-self-start mr-1"
        >
          <template v-if="list.games.length">
            <div
              v-for="(game, index) in list.games"
              :key="index"
              style="width: 60px"
              class="p-1 d-flex"
              :class="[
                gameId && game.id === gameId ? 'bg-danger' : darkTheme ? 'border-black bg-dark' : 'border-light bg-white',
                {
                  'border-bottom' : index !== list.games.length - 1,
                }
              ]"
            >
              <b-avatar
                style="border-radius: 4px !important"
                text=" "
                :src="gameId && game.id === gameId ? game.src : coversInMiniBoards ? game.src : null"
                :variant="darkTheme ? 'black' : 'light'"
                size="24"
              />
            </div>
          </template>

          <div
            v-else
            class="rounded overflow-hidden"
            style="height: 22px; width: 60px;"
          />
        </b-card>
      </div>
    </div>
  </b-card>
</template>

<script>
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER, IMAGE_SIZE_THUMB } from '@/constants';
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  props: {
    board: Object,
    gameId: Number,
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
    ...mapGetters(['darkTheme', 'coversInMiniBoards']),

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

    firstList() {
      return this.formattedBoard?.lists?.[0] || {};
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
}

.board {
  max-height: $boardHeight;
}

.kanban-list {
  max-height: 152px;
}
</style>
