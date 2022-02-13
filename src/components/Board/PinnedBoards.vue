<template lang="html">
  <div>
    <template v-if="pinnedBoards.length">
      <!-- v-for="{ id, name, backgroundColor, backgroundUrl } in pinnedBoards" -->
      <b-button
        v-for="{ id, name } in pinnedBoards"
        :key="id"
        block
        :title="name"
        :variant="board.name === name ? 'warning' : null"
        :class="['mb-1 p-0 cursor-pointer pinned-board', { active: board.name === name }]"
        @click="viewBoard(id)"
      >
        <!-- <b-avatar
          rounded
          :style="`
          ${backgroundColor ? `background-color: ${backgroundColor};` : null }
          ${getWallpaperUrl(backgroundUrl)}
          `"
        >
          <span class="board-initials text-uppercase"></span>
        </b-avatar> -->
        <!-- {{ backgroundColor }} -->
        <!-- <pre>{{ backgroundUrl }}</pre> -->
        {{ getBoardInitials(name) }}
      </b-button>

      <hr class="mb-2 mt-0">
    </template>

    <template v-if="isBoard && !board.pinned">
      <b-avatar
        rounded
        class="active pinned-board"
        :title="board.name"
        :style="`
        ${board.backgroundColor ? ` background-color: ${board.backgroundColor};` : null }
        ${getWallpaperUrl(board.backgroundUrl) }
        `"
        @click.native="$bvModal.show('edit-board')"
      >
        <span class="board-initials text-uppercase mr-1">
          {{ getBoardInitials(board.name) }}
        </span>
      </b-avatar>

      <hr class="my-1">
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'boards', 'wallpapers']),
    ...mapGetters(['sortedBoards']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },

    hasMultipleBoards() {
      return this.$route.name === 'board' && this.board.name && this.sortedBoards.length > 1;
    },

    pinnedBoards() {
      return this.boards.filter(({ pinned }) => pinned);
    },
  },

  methods: {
    getWallpaperUrl(url) {
      if (!url) {
        return '';
      }

      if (url && url.includes('igdb.com')) {
        return `background-image: url(${url});`;
      }

      const wallpaperObject = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaperObject && wallpaperObject.url
        ? `background-image: url(${wallpaperObject.url});`
        : '';
    },

    viewBoard(id) {
      if (this.board.id !== id) {
        this.$router.push({ name: 'board', params: { id } });
      } else {
        this.$bvModal.show('edit-board');
      }
    },

    getBoardInitials(boardName) {
      const boardInitials = boardName
        ? boardName.split(' ').map(n => n[0]).join('')
        : '';

      return boardInitials.length > 2
        ? boardInitials.substring(0, 2)
        : boardInitials;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pinned-board {
    background-size: cover;

    &.active {
      box-shadow: inset 0 0 0 2px black;
    }
  }

  .board-initials {
    color: white;
    text-shadow: 1px 1px black;
  }

</style>
