<template lang="html">
  <portal to="logo" v-if="boards.length">
    <b-dropdown
      class="ml-2"
      toggle-class="px-0"
      variant="transparent"
    >
      <template v-slot:button-content>
        {{ board.name }}
        <i class="fas fa-caret-down fa-fw" aria-hidden />
      </template>

      <b-dropdown-item-button
        size="sm"
        v-b-modal:edit-board
      >
        <i class="fas fa-pencil-alt fa-fw" aria-hidden />
        Edit board
      </b-dropdown-item-button>

      <b-dropdown-divider />

      <b-dropdown-item-button
        size="sm"
        v-b-modal:create-board
      >
        <i class="fas fa-plus fa-fw" aria-hidden></i>
        Create new board
      </b-dropdown-item-button>

      <!-- TODO: create array map with url already fetched -->
      <!-- TODO: filter out current board -->

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
              ${getWallpaperUrl(backgroundUrl)}
              background-color: ${backgroundColor ? backgroundColor : ''}
              `"
          />

          {{ name }}
        </b-dropdown-item-button>
      </template>
    </b-dropdown>
  </portal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'wallpapers', 'boards']),
  },

  methods: {
    viewBoard(id) {
      if (this.board.id !== id) {
        this.$router.push({ name: 'board', params: { id } });
      } else {
        this.$bvModal.show('edit-board');
      }
    },

    getWallpaperUrl(url) {
      // TODO: only return url, not css.
      if (!url) {
        return '';
      }

      if (url && url.includes('igdb.com')) {
        return `background-image: url(${url});`;
      }

      const wallpaperObject = this.wallpapers.find(({ fullPath }) => fullPath === url);

      return wallpaperObject && wallpaperObject.url
        ? `background-image: url(${decodeURI(wallpaperObject.url)});`
        : '';
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
