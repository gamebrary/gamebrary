<template lang="html">
  <nav
    :class="['dock d-flex align-items-center justify-content-between w-100',
      { 'position-fixed': isBoard }]"
  >
    <div>
      <b-button
        title="Dashboard"
        squared
        variant="transparent"
        class="p-0 ml-2"
        @click="handleLogoClick"
      >
        <img
          :src="`/static/gamebrary-logo${darkTheme || board.backgroundUrl ? '' : '-dark'}.png`"
          width="32"
        />
      </b-button>

      <span v-if="pageTitle">{{ pageTitle }}</span>

      <b-dropdown
        v-if="user && showBoardsDropdown"
        :toggle-class="['p-0', { 'text-white': darkTheme || board.backgroundUrl }]"
        variant="transparent"
        :menu-class="darkTheme ? 'bg-dark' : ''"
        :text="board.name"
      >
        <!-- TODO: create array map with url already fetched -->
        <b-dropdown-item
          v-for="{ id, name, backgroundColor, backgroundUrl } in boards"
          :key="id"
          :active="board.name === name"
          :variant="darkTheme ? 'primary' : ''"
          @click.native="viewBoard(id)"
        >
          <b-avatar
            rounded
            class="board mr-2"
            :title="name"
            :variant="darkTheme ? 'dark' : 'info'"
            text=" "
            :style="`
            ${getWallpaperUrl(backgroundUrl)}
            ${backgroundColor ? `background-color: ${backgroundColor};` : '' }
            `"
          />

          {{ name }}
        </b-dropdown-item>
            <!-- <b-collapse
              v-if="user"

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


            </b-collapse> -->

            <!-- <b-button
              v-if="user"
              :variant="darkTheme ? 'dark' : 'light'"
              class="mx-1 mb-1 py-0"
              size="sm"
            >
            </b-button> -->
      </b-dropdown>

      <span v-else>
        {{ board.name }}
      </span>
    </div>

    <div class="d-flex">
      <portal-target name="dock" />

      <b-dropdown
        v-if="user"
        right
        no-caret
        :variant="darkTheme ? 'dark' : 'light'"
        :menu-class="darkTheme ? 'bg-dark' : ''"
        toggle-class="p-0 mx-2 border-0"
      >
        <template #button-content>
          <b-avatar
            rounded
            size="38"
            :src="user.photoURL ? user.photoURL : null"
          />
        </template>

        <b-dropdown-header>
          Hi, {{ user.displayName }}!
        </b-dropdown-header>

        <b-dropdown-item
          :to="{ name: 'releases' }"
          :variant="darkTheme ? 'primary' : ''"
        >
          <i class="fas fa-rocket fa-fw" aria-hidden />
          Releases
        </b-dropdown-item>

        <b-dropdown-item :to="{ name: 'profile' }">
          <i class="fas fa-user fa-fw" aria-hidden />
          Profile
        </b-dropdown-item>

        <b-dropdown-item
          :variant="darkTheme ? 'primary' : ''"
          :to="{ name: 'settings' }"
        >
          <i class="fas fa-cog fa-fw" aria-hidden />
          Settings
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item-button
          :variant="darkTheme ? 'primary' : ''"
          @click="session_signOut"
        >
          <i class="fas fa-sign-out-alt fa-fw" aria-hidden />
          {{ $t('global.signOut') }}
        </b-dropdown-item-button>
      </b-dropdown>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import sessionMixin from '@/mixins/sessionMixin';
import PinnedBoards from '@/components/Board/PinnedBoards';

export default {
  components: {
    PinnedBoards,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['board', 'boards', 'notification', 'user', 'wallpapers']),
    ...mapGetters(['darkTheme', 'isBoardOwner']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },

    showBoardsDropdown() {
      return this.isBoard && this.isBoardOwner;
    },

    pageTitle() {
      return this.$route.meta && this.$route.meta.title;
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

    handleLogoClick() {
      if (!this.user) {
        if (this.$route.name === 'public-boards') {
          this.$bvModal.show('authModal');
        } else {
          this.$router.push({ name: 'public-boards' });
        }
      }

      if (this.user && this.$route.name !== 'dashboard') {
        this.$router.push({ name: 'dashboard' });
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
.dock {
  z-index: 1;
  height: 54px;
}

.board {
  background-size: cover;
  background-position: center;
}
</style>
