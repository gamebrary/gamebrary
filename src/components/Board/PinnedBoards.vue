<template lang="html">
  <div>
    <template v-if="pinnedBoards.length">
      <span
        v-for="{ id, name, backgroundColor, wallpaper } in pinnedBoards"
        :key="id"
      >
        <b-avatar
          rounded
          :class="['mb-1 cursor-pointer pinned-board', { active: board.name === name }]"
          :title="name"
          @click.native="viewBoard(id)"
          :style="`
          ${backgroundColor ? `background-color: ${backgroundColor};` : null }
          ${getWallpaperUrl(wallpaper) }
          `"
        >
          <span class="board-initials text-uppercase">{{ getBoardInitials(name) }}</span>
        </b-avatar>
      </span>

      <hr class="mb-1 mt-0">
    </template>

    <template v-if="isBoard && !board.pinned">
      <b-avatar
        rounded
        class="active pinned-board"
        :title="board.name"
        :style="`
        ${board.backgroundColor ? ` background-color: ${board.backgroundColor};` : null }
        ${getWallpaperUrl(board.wallpaper) }
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
    ...mapGetters(['sortedBoards', 'nightMode']),

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
    getWallpaperUrl(wallpaper) {
      const wallpaperObject = wallpaper && this.wallpapers.length
        ? this.wallpapers.find(({ fullPath }) => fullPath === wallpaper)
        : null;

      return wallpaperObject && wallpaperObject.url
        ? `background-image: url(${wallpaperObject.url});`
        : null;
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
