<template lang="html">
  <nav
    class="dock p-2 d-flex align-items-center justify-content-between w-100"
    :class="{ 'position-fixed': isBoard }"
  >
    <div>
      <b-button
        title="Dashboard"
        squared
        variant="transparent"
        v-b-toggle.menu
        class="p-0 ml-2"
      >
        <img
          src="/static/gamebrary-logo.png"
          width="32"
        />
      </b-button>

      <span v-if="pageTitle" class="d-sm-none">{{ pageTitle }}</span>
      <sidebar />

      <!-- TODO: move to board page and use portal -->
      <b-dropdown
        v-if="user && showBoardsDropdown && boards.length > 1"
        variant="transparent"
        :text="board.name"
      >
        <!-- TODO: create array map with url already fetched -->
        <b-dropdown-item
          v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
          :key="id"
          :active="board.name === name"
          @click.native="viewBoard(id)"
        >
          <b-avatar
            rounded
            class="board mr-2"
            :title="name"
            text=" "
            :style="`
            ${getWallpaperUrl(backgroundUrl)}
            ${backgroundColor ? `background-color: ${backgroundColor};` : '' }
            `"
          />

          {{ name }}
        </b-dropdown-item>
      </b-dropdown>

      <span v-else>
        {{ board.name }}
      </span>
    </div>

    <div class="d-flex">
      <portal-target name="dock" />
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import Sidebar from '@/components/Sidebar';

export default {
  components: {
    PinnedBoards,
    Sidebar,
  },

  computed: {
    ...mapState(['board', 'boards', 'notification', 'user', 'wallpapers', 'sessionExpired', 'publicBoards']),
    ...mapGetters(['isBoardOwner']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },

    showBoardsDropdown() {
      return this.isBoard && this.boards.length && this.isBoardOwner;
    },

    pageTitle() {
      return this.$route.meta && this.$route.meta.title;
    },

    showDevTools() {
      return process.env.NODE_ENV === 'development';
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
        ? `background-image: url(${decodeURI(wallpaperObject.url)});`
        : '';
    },

    viewBoard(id) {
      if (this.board.id !== id) {
        this.$router.push({ name: 'board', params: { id } });
      } else {
        this.$bvModal.show('edit-board');
      }
    },

    // handleLogoClick() {
    //   if (!this.user) {
    //     if (this.$route.name === 'public-boards') {
    //       this.$bvModal.show('authModal');
    //     } else {
    //       this.$router.push({ name: 'public-boards' });
    //     }
    //   }
    //
    //   if (this.user && this.$route.name !== 'dashboard') {
    //     this.$router.push({ name: 'dashboard' });
    //   }
    // },

    // async pinBoard() {
    //   const payload = {
    //     ...this.board,
    //     pinned: !this.board.pinned,
    //   };
    //
    //   this.$store.commit('SET_ACTIVE_BOARD', payload);
    //
    //   await this.$store.dispatch('SAVE_BOARD')
    //     .catch(() => {
    //       this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
    //     });
    //
    //   this.$bvToast.toast('Board settings saved');
    // },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dock {
  z-index: 1;
  height: 54px;
}

.board {
  background-size: cover;
  background-position: center;
}
</style>
