<template lang="html">
  <div>
    <span
      v-for="{ id, name, backgroundColor, wallpaper } in pinnedBoards"
      :key="id"
    >
      <b-avatar
        v-if="board.name !== name"
        rounded
        :text="getBoardInitials(name)"
        class="mb-1 cursor-pointer pinned-board"
        :title="name"
        @click.native="viewBoard(id)"
        :style="`
        ${backgroundColor ? `background-color: ${backgroundColor};` : null }
        ${getWallpaperUrl(wallpaper) }
        `"
      />

      <b-dropdown
        v-else
        dropright
        no-caret
        toggle-class="p-0 mb-1 border-primary"
        toggle-tag="span"
      >
        <template #button-content>
          <b-avatar
            rounded
            class="pinned-board"
            :style="`
            ${board.backgroundColor ? ` background-color: ${board.backgroundColor};` : null }
            ${getWallpaperUrl(wallpaper) }
            `"
          >
            <span class="text-uppercase mr-1">{{ getBoardInitials(board.name) }}</span>
            <i class="fas fa-caret-down" aria-hidden />
          </b-avatar>
        </template>

        <b-dropdown-header id="dropdown-header-label">
          {{ board.name }}
        </b-dropdown-header>

        <b-dropdown-item v-b-modal:board-settings>Edit board</b-dropdown-item>
        <b-dropdown-item v-b-modal:add-list>Add list</b-dropdown-item>
        <b-dropdown-item @click="pinBoard">
          {{ board.pinned ? 'Unpin from dock' : 'Pin to dock' }}
        </b-dropdown-item>
      </b-dropdown>
    </span>

    <hr class="mt-1 mb-2">

    <b-dropdown
      dropright
      no-caret
      toggle-class="p-0 mb-1"
      toggle-tag="span"
      v-if="isBoard && !board.pinned"
    >
      <template #button-content>
        <b-avatar
          rounded
          class="pinned-board"
          :style="`${board.backgroundColor
            ? `background-color: ${board.backgroundColor};`
            : null };
            ${getWallpaperUrl(board.wallpaper)}
            `"
        >
          <span class="text-uppercase mr-1">{{ getBoardInitials(board.name) }}</span>
          <i class="fas fa-caret-down" aria-hidden />
        </b-avatar>
      </template>

      <b-dropdown-header id="dropdown-header-label">
        {{ board.name }}
      </b-dropdown-header>
      <b-dropdown-item v-b-modal:board-settings>Edit board</b-dropdown-item>
      <b-dropdown-item v-b-modal:add-list>Add list</b-dropdown-item>
      <b-dropdown-item @click="pinBoard">
        {{ board.pinned ? 'Unpin from dock' : 'Pin to dock' }}
      </b-dropdown-item>
    </b-dropdown>
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

    async pinBoard() {
      const payload = {
        ...this.board,
        pinned: !this.board.pinned,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);
      this.$store.commit('UPDATE_BOARDS', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.$bvToast.toast('Board settings saved');
    },

    viewBoard(id) {
      if (this.board.id !== id) {
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
  .pinned-board {
    background-size: cover;
  }
</style>
