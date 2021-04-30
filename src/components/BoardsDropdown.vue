<template lang="html">
  <portal to="logo" v-if="boards.length">
    <b-button v-if="boards.length === 1">
      {{ board.name }}
    </b-button>

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
        <span class="ml-2 bg-danger">
          {{ board.name }}
        </span>

        <div>
          <b-button>
            <i class="fas fa-pencil-alt" aria-hidden></i>
          </b-button>
          <b-button>
            <i class="fas fa-share-alt fa-fw" aria-hidden />
          </b-button>
        </div>
      </div>

      <!-- TODO: create array map with url already fetched -->
      <!-- TODO: filter out current board -->
      <b-dropdown-divider />

      Other boards

      <b-dropdown-item
        v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
        :key="id"
        :active="board.name === name"
        @click.native="viewBoard(id)"
      >
        <b-avatar
          rounded
          class="board-thumbnail mr-2"
          :title="name"
          text=" "
          :style="`
          ${getWallpaperUrl(backgroundUrl)}
          ${backgroundColor ? `background-color: ${backgroundColor};` : '#ccc' }
          `"
        />

        {{ name }}
        <small
          v-if="board.id === id"
          class="text-muted mx-2"
        >
          Edit
        </small>
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
</style>
