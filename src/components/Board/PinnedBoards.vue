<template lang="html">
  <nav>
    <template v-if="boards.length">
      <b-button
        v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
        :key="id"
        block
        :title="name"
        :style="`
        ${backgroundColor ? `background-color: ${backgroundColor};` : '' }
        ${getWallpaperUrl(backgroundUrl)}
        `"
        :class="['mb-1 pinned-board', { active: board.name === name }]"
        @click="viewBoard(id)"
      >
        <span class="board-initials text-uppercase">{{ getBoardInitials(name) }}</span>
      </b-button>

      <hr class="mb-2 mt-0">
    </template>

    <template v-if="isBoard && !board.pinned">
      <b-button
        class="active pinned-board"
        :title="board.name"
        :style="`
        ${board.backgroundColor ? ` background-color: ${board.backgroundColor};` : null }
        ${getWallpaperUrl(board.backgroundUrl) }
        `"
        @click="$bvModal.show('edit-board')"
      >
        <span class="board-initials text-uppercase mr-1">
          {{ getBoardInitials(board.name) }}
        </span>
      </b-button>

      <hr class="my-1">
    </template>
  </nav>
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
      if (!url) return '';
      if (url && url.includes('igdb.com')) return `background-image: url(${url});`;

      const wallpaperObject = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaperObject && wallpaperObject.url
        ? `background-image: url(${wallpaperObject.url});`
        : '';
    },

    viewBoard(id) {
      if (this.$route.name === 'board' && this.board.id === id) {
        this.$bvModal.show('edit-board');
      } else {
        this.$router.push({ name: 'board', params: { id } });
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
  nav {
    overflow-y: auto;
    max-height: calc(100vh - 100px);

  }

  .pinned-board {
    background-size: cover;

    &.active {
      box-shadow: inset 0 0 0 2px yellow;
    }
  }

  .board-initials {
    color: white;
    text-shadow: 1px 1px black;
  }

</style>
