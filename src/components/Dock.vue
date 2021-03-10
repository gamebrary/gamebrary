<template lang="html">
  <nav
    :class="['bg-danger p-0 d-flex justify-content-between position-absolute dock']"
  >
  <!-- :class="{
    'bg-dark text-white border-info': darkTheme,
    'bg-white': !darkTheme,
  }" -->
    <div>
      <b-button
        title="Dashboard"
        squared
        variant="transparent"
        class="m-0 p-1"
        @click="handleLogoClick"
      >
        <img
          :src="`/static/gamebrary-logo${darkTheme || board.backgroundUrl ? '' : '-dark'}.png`"
          width="32"
        />
      </b-button>

      <b-dropdown
        v-if="Object.keys(board).length"
        :toggle-class="['p-0', { 'text-white': darkTheme || board.backgroundUrl }]"
        variant="transparent"
      >
        <template #button-content>
          <small>{{ board.name }}</small>
        </template>

        <b-dropdown-header>
          My boards
        </b-dropdown-header>

        <b-dropdown-item
          v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
          :key="id"
          :active="board.name === name"
          @click.native="viewBoard(id)"
        >
          <b-avatar
            rounded
            class="board"
            :title="name"
            text=" "
            :style="`
            ${backgroundColor ? `background-color: ${backgroundColor};` : null }
            ${getWallpaperUrl(backgroundUrl)}
            `"
          />
          <!-- TODO: create array map with url already fetched -->

          {{ name }}

          <pre>{{ getWallpaperUrl(backgroundUrl) }}</pre>
        </b-dropdown-item>


        <!-- <b-dropdown-item>Second Action</b-dropdown-item>
        <b-dropdown-item>Third Action</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item active>Active action</b-dropdown-item>
        <b-dropdown-item disabled>Disabled action</b-dropdown-item> -->

            <!-- <b-collapse
              v-if="user"
              id="moreMenu"
              v-model="moreMenuOpen"
            >

              <b-button
                :to="{ name: 'notes' }"
                :variant="darkTheme ? 'dark' : 'light'"
                class="mt-1"
                size="sm"
                title="Notes"
              >
                <i class="fas fa-sticky-note fa-fw" aria-hidden />
              </b-button>

              <b-button
                :to="{ name: 'wallpapers' }"
                :variant="darkTheme ? 'dark' : 'light'"
                class="mt-1"
                size="sm"
                title="Wallpapers"
              >
                <i class="fas fa-images fa-fw" aria-hidden />
              </b-button>

              <b-button
                :variant="darkTheme ? 'dark' : 'light'"
                class="mt-1 d-none d-sm-inline"
                size="sm"
                v-b-modal:keyboard-shortcuts
                title="Keyboard shortcuts"
              >
                <i class="fas fa-keyboard fa-fw" aria-hidden />
              </b-button>

              <hr class="my-1">

              <b-button
                :to="{ name: 'about' }"
                :variant="darkTheme ? 'dark' : 'light'"
                class="mx-1 mb-1"
                size="sm"
                title="About"
              >
                <i class="fas fa-info fa-fw" aria-hidden />
              </b-button>
            </b-collapse> -->

            <!-- TODO: persist value -->
            <!-- <b-button
              v-if="user"
              v-b-toggle.moreMenu
              :variant="darkTheme ? 'dark' : 'light'"
              class="mx-1 mb-1 py-0"
              size="sm"
            >
              <i :class="`fas fa-angle-double-${moreMenuOpen ? 'up' : 'down'} fa-fw`" />
            </b-button> -->

            <!-- <b-button
              :to="{ name: 'releases' }"
              class="latest-release mx-2 py-0 position-fixed"
              variant="transparent"
              size="sm"
            >
              <small class="text-muted">{{ latestRelease }}</small>
            </b-button> -->
      </b-dropdown>
    </div>

    <b-dropdown
      right
      no-caret
      variant="transparent"
      toggle-class="p-0"
    >
      <template #button-content>
        <b-avatar
          v-if="user && user.photoURL"
          rounded
          size="32"
          :src="user.photoURL"
        />
      </template>

      <b-dropdown-header>
        Hi, {{ user.displayName }}!
      </b-dropdown-header>

      <b-dropdown-item :to="{ name: 'profile' }">
        <i class="fas fa-user fa-fw" aria-hidden /> Profile
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'settings' }">
        <i class="fas fa-cog fa-fw" aria-hidden /> Settings
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item>Log out</b-dropdown-item>
    </b-dropdown>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';

export default {
  components: {
    PinnedBoards,
  },

  data() {
    return {
      moreMenuOpen: false,
      postion: 'bottom',
    };
  },

  computed: {
    ...mapState(['board', 'boards', 'notification', 'user', 'releases', 'wallpapers']),
    ...mapGetters(['darkTheme']),

    latestRelease() {
      // eslint-disable-next-line
      const [latestRelease] = this.releases;

      // eslint-disable-next-line
      return latestRelease && latestRelease.tag_name;
    },

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
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

      const test = wallpaperObject && wallpaperObject.url
        ? `background-image: url(${decodeURI(wallpaperObject.url)});`
        : '';

      console.log(test);

      return test;
    },

    viewBoard(id) {
      console.log(id);
      if (this.board.id !== id) {
        this.$router.push({ name: 'board', params: { id } });
      } else {
        this.$bvModal.show('edit-board');
      }
    },

    handleLogoClick() {
      if (!this.user) {
        if (this.$route.name === 'public-boards') {
          this.$bvModal.show('authModal');
        } else {
          this.$router.push({ name: 'public-boards' });
        }
      }

      if (this.user && this.$route.name !== 'boards') {
        this.$router.push({ name: 'boards' });
      }
    },

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
.latest-release {
  bottom: .5rem;
  padding: 0;
  width: 40px;
  left: .33rem;
}

.dock {
  z-index: 1;
  width: calc(100% - calc(100vw - 100%));

  &.bottom {
    position: fixed;
  }
}

.board {
  background-size: cover;
  background-position: center;
}
</style>
