<!-- TODO: use board thumbnail once fully migrated -->
<template lang="html">
  <div
    :class="['mini-board overflow-hidden rounded cursor-pointer m-0', miniBoardClass]"
    :style="miniBoardStyles"
  >
    <header class="text-small py-1 px-2 d-flex align-items-center justify-content-between">
      <span :class="['mr-1 mb-1', { 'text-outlined': hasCustomBackground || darkTheme } ]">
        {{ board.name }}
      </span>

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
        class="tier d-flex mx-2"
        v-for="tier in board.lists"
        style="margin-bottom: 1px;"
        :key="tier.id"
      >
        <b-avatar :style="`background-color: ${tier.backgroundColor}`" square text=" " size="20" />
        <b-avatar v-for="(game, index) in tier.games" :key="index" square text=" " style="margin-right: 1px;" size="20" />
      </div>
    </div>

    <div v-else-if="isStandardBoard" class="lists rounded overflow-hidden w-100 justify-content-center">
      <div class="list basic rounded overflow-hidden border">
        <template v-if="firstList.games.length">
          <div
            v-for="(game, index) in firstList.games"
            :key="index"
            :class="['bg-light', { 'border-bottom': index !== firstList.games.length - 1 }]"
          >
            <i class="fas fa-square fa-fw text-white" style="margin-left: 1px;" aria-hidden />
            <small v-if="board.ranked" class="mx-1">{{ index + 1 }}</small>
          </div>
        </template>

        <div
          v-else
          class="rounded overflow-hidden list bg-secondary"
          style="height: 22px;"
        />
      </div>
    </div>

    <div v-else class="lists rounded overflow-hidden">
      <div
        v-for="(list, listIndex) in board.lists"
        :key="listIndex"
        class="list rounded overflow-hidden ml-2 border align-self-start"
      >
        <template v-if="list.games.length">
          <div
            v-for="(game, index) in list.games"
            :key="index"
            style="width: 60px"
            :class="['list bg-light', { 'border-bottom': index !== list.games.length - 1 }]"
          >
            <i class="fas fa-square fa-fw text-white" style="margin-left: 1px;" aria-hidden />
          </div>
        </template>

        <div
          v-else
          class="rounded overflow-hidden list bg-secondary"
          style="height: 22px;"
        />
      </div>
    </div>
  </div>
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
    ...mapState(['settings']),
    ...mapGetters(['darkTheme']),

    hasCustomBackground() {
      return this.board?.backgroundColor || this.board?.backgroundUrl;
    },

    miniBoardClass() {
      if (this.hasCustomBackground) return;

      return this.darkTheme ? 'bg-secondary' : 'bg-light';
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

    miniBoardStyles() {
      if (this.backgroundUrl) return `background-image: url(${this.backgroundUrl});`

      return this.board?.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;
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
$boardHeight: 220px;

.mini-board {
  background-repeat: no-repeat;
  background-size: cover;
  height: $boardHeight;
}

.lists {
  max-height: $boardHeight - 40px;
  display: inline-flex;
}

.list {
  width: 60px;
  max-height: 160px;

  &.basic {
    width: 80px;
  }
}
</style>
