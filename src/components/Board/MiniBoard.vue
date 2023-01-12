<template lang="html">
  <b-card
    class=" cursor-pointer overflow-hidden"
    :bg-variant="darkTheme ? 'dark' : 'transparent'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    body-class="p-0"
    content-class="rounded"
  >
    <div
      :style="backgroundSyle"
      class="mini-board"
    >
      <header class="text-small py-1 px-2 d-flex align-items-center justify-content-between">
        <h4 :class="['', { 'text-white': hasCustomBackground || darkTheme } ]">
          {{ board.name }}
        </h4>

        <b-badge
          v-if="showPublicIndicator"
          class="bg-warning"
          size="sm"
        >
          Public
        </b-badge>
      </header>

      <div v-if="isTierBoard">
        <div
          class="d-flex mx-2"
          v-for="tier in board.lists"
          style="margin-bottom: 4px;"
          :key="tier.id"
        >
          <b-avatar
            :style="`background-color: ${tier.backgroundColor}; border-radius: 4px !important;`"
            text=" "
            size="20"
          />

          <b-avatar
            :variant="darkTheme ? 'secondary' : 'light'"
            v-for="(game, index) in tier.games"
            :key="index"
            text=" "
            square
            style="margin-left: 4px; border-radius: 4px !important;"
            size="20"
          />
        </div>
      </div>

      <div v-else-if="isStandardBoard" class="lists rounded overflow-hidden w-100 justify-content-center">
        <b-card
          body-class="p-0"
          :bg-variant="darkTheme ? 'secondary' : 'transparent'"
          :text-variant="darkTheme ? 'light' : 'dark'"
          style="width: 80px"
          class="overflow-hidden align-self-start"
        >
          <template v-if="firstList.games.length">
            <div
              v-for="(game, index) in firstList.games"
              :key="index"
              :class="[ darkTheme ? 'border-secondary bg-dark' : 'border-light bg-white', { 'border-bottom': index !== firstList.games.length - 1 }]"
            >
              <b-avatar
                :style="`border-radius: 4px !important;`"
                text=" "
                :variant="darkTheme ? 'secondary' : 'light'"
                class="m-1"
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

      <div v-else class="lists rounded overflow-hidden">
        <b-card
          v-for="(list, listIndex) in board.lists"
          :key="listIndex"
          body-class="p-0 kanban-list"
          :bg-variant="darkTheme ? 'secondary' : 'transparent'"
          :text-variant="darkTheme ? 'light' : 'dark'"
          class="overflow-hidden ml-2 align-self-start"
        >
          <template v-if="list.games.length">
            <div
              v-for="(game, index) in list.games"
              :key="index"
              style="width: 60px"
              :class="['d-flex', darkTheme ? 'border-secondary bg-dark' : 'border-light bg-white', { 'border-bottom' : index !== list.games.length - 1 } ]"
            >
              <b-avatar
                :style="`border-radius: 4px !important;`"
                text=" "
                :variant="darkTheme ? 'secondary' : 'light'"
                class="m-1"
                size="20"
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
import { BOARD_TYPE_STANDARD, BOARD_TYPE_TIER } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    board: Object,
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
    ...mapState(['settings', 'games']),
    ...mapGetters(['darkTheme']),

    hasCustomBackground() {
      return this.board?.backgroundColor || this.board?.backgroundUrl;
    },

    showPublicIndicator() {
      return this.$route.name !== 'explore' && this.board?.isPublic;
    },

    isStandardBoard() {
      return this.board?.type === BOARD_TYPE_STANDARD;
    },

    isTierBoard() {
      return this.board?.type === BOARD_TYPE_TIER;
    },

    firstList() {
      const [firstList] = this.board?.lists;

      return firstList;
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
}

.lists {
  max-height: $boardHeight - 40px;
  display: inline-flex;
  height: 160px;
}

.kanban-list {
  max-height: 146px;
}
</style>
