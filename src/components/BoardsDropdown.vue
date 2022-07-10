<template lang="html">
  <div>
    <b-button
      variant="light"
      :to="{ name: 'board.edit', params: { id: board.id } }"
    >
      {{ board.name }}
    </b-button>
    <!-- TODO: Clone board -->
    <!-- TODO: like/favorite board -->
    <!-- TODO: Fork board -->

    <!-- <b-dropdown
      class="mr-2 boards-dropdown"
      variant="dark"
      v-b-tooltip.hover
      right
      :title="board.name"
    >
      <b-dropdown-item
        size="sm"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        <i class="fas fa-pencil-alt fa-fw" aria-hidden />
        Edit board
      </b-dropdown-item>

      <b-dropdown-divider />

      <b-dropdown-item
        size="sm"
        :to="{ name: 'create.board' }"
      >
        <i class="fas fa-plus fa-fw" aria-hidden></i>
        Create new board
      </b-dropdown-item>

      <template v-if="filteredBoards.length">
        <b-dropdown-divider />

        <span class="m-2 text-muted">Other boards:</span>

        <b-dropdown-item-button
          v-for="{ id, name, backgroundColor, backgroundUrl } in filteredBoards"
          :key="id"
          :active="board.name === name"
          @click="viewBoard(id)"
        >
          <b-avatar
            rounded
            :class="['board-thumbnail mr-2', { 'bg-dark' : !backgroundColor }]"
            :title="name"
            text=" "
            :style="`
              background-image: url(${backgroundUrl ? backgroundUrl : ''});
              background-color: ${backgroundColor ? backgroundColor : ''}
              `"
          />

          {{ name }}
        </b-dropdown-item-button>
      </template>
    </b-dropdown> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'wallpapers', 'boards', 'settings']),

    buttonRoute() {
      // { name: 'board.edit', params: { id: board.id } }
      return this.$route.name;
    },

    filteredBoards() {
      return this.boards
        .filter(({ id }) => id !== this.board.id)
        .map((board) => {
          const backgroundUrl = this.getWallpaperUrl(board.backgroundUrl);

          return {
            ...board,
            backgroundUrl,
          };
        });
    },

    boardInitials() {
      return this.board.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    },

    boardBackgroundUrl() {
      return this.getWallpaperUrl(this.board?.backgroundUrl);
    },
  },

  methods: {
    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.board-thumbnail {
  background-size: cover;
  background-position: center;
}

.board-actions {
  display: grid;
  align-items: center;
  grid-template-columns: auto 70px;
  grid-gap: .5rem;
}
</style>

<style lang="scss" rel="stylesheet/scss">
.boards-dropdown .dropdown-menu {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
