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

      <div class="d-flex align-items-center justify-content-between">
        <span class="ml-2">
          {{ board.name }}
        </span>

        <b-button
          variant="secondary"
          size="sm"
          v-b-modal:edit-board
        >
          <i class="fas fa-pencil-alt fa-fw" aria-hidden />
        </b-button>
      </div>

      <!-- TODO: create array map with url already fetched -->
      <!-- TODO: filter out current board -->
      <b-dropdown-divider />

      <span class="m-2">Other boards</span>

      <b-dropdown-item
        v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
        :key="id"
        :active="board.name === name"
        @click.native="viewBoard(id)"
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
      </b-dropdown-item>
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
