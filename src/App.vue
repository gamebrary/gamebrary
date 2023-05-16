<!-- TODO: add slideshow view (based on games on board/list) -->
<!-- TODO: replace toasts with custom alert -->
<!-- TODO: add local storage size progress bar (in dev tools?) -->
<!-- TODO: smart lists based on liked games -->
<!-- TODO: finish unauthed UI -->
<!-- TODO: add universal search, default based on page visited, allow to change -->
<!-- TODO: add board lock/readonly -->
<!-- TODO: use ribbon to show game type in search (e.g. mods, ports, etc) -->
<!-- TODO: find better light and white (for reading) colors -->
<!-- TODO: finish speedruns -->
<!-- TODO: add parental controls (filter out erotic games) -->
<!-- TODO: deku deals integration https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frsshub.app%2Fdekudeals%2Fmost-wanted -->
<!-- TODO: use https://github.com/twitchtv/igdb-api-node -->
<!-- TODO: [searchPage] show option to clear search text if no results AND filters on -->
<!-- TODO: [searchPage] remove filter if selected -->
<!-- TODO: [searchPage] add sorting -->
<!-- TODO: [searchPage] use route query for offset & limit -->
<!-- TODO: [gamePage] put stuff in components -->
<!-- TODO: [gamePage] figure out publisher/dev logos -->
<!-- TODO: [gamePage] add pc requirements from steam -->
<!-- TODO: [gamePage] show igdb tags and franchise data -->
<!-- TODO: [gamePage] integrate with twitch -->
<!-- TODO: [gamePage] load all achievements -->
<!-- TODO: [gamePage] handle gog game on sale -->
<!-- TODO: [gamePage] find a good use for gameHeaderImage -->
<!-- TODO: [gamePage] list all sources and logos -->
<!-- TODO: [gamePage] link and add filter game engines -->
<!-- TODO: [gamePage] restore release dates -->
<!-- TODO: [boardPage] clone/fork board -->
<!-- TODO: [boardPage] like/favorite board -->
<!-- TODO: [editBoardPage] copy/move list to different board -->
<!-- TODO: [editBoardPage] add background options (position, repeat, etc...) -->
<!-- TODO: use thumbnails for mini boards -->
<template>
  <main
    id="app"
    :class="[darkTheme ? 'dark' : 'light', navPosition]"
    :style="style"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <b-spinner v-if="loading" class="spinner-centered mt-5" />

    <template v-else>
      <page-header />
      <router-view :class="['viewport', { 'game-page': isGamePage }]" />
      <keyboard-shortcuts-modal />
      <markdown-cheatsheet />
    </template>
  </main>
</template>

<script>
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import PageHeader from '@/components/PageHeader';
import sessionMixin from '@/mixins/sessionMixin';
import firebase from 'firebase/app';
import { mapState, mapGetters } from 'vuex';
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG, IGDB_QUERIES } from '@/constants';

firebase.initializeApp(FIREBASE_CONFIG);

export default {
  name: 'App',

  components: {
    PageHeader,
    MarkdownCheatsheet,
    KeyboardShortcutsModal,
  },

  mixins: [sessionMixin],

  data() {
    return {
      loading: false,
      debugUserId: null,
      backgroundImageUrl: null,
      backgroundColor: null,
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'sessionExpired', 'platforms']),
    ...mapGetters(['darkTheme']),

    style() {
      const backgroundImage = ['game', 'board'].includes(this.$route?.name) && this.backgroundImageUrl
        ? `background-image: url('${this.backgroundImageUrl}');`
        : null;

      const backgroundColor = this.backgroundColor
        ? `background-color: ${this.backgroundColor};`
        : null;

      return [backgroundImage, backgroundColor].join('');
    },

    isPublicRoute() {
      return this.$route.meta?.public;
    },

    isGamePage() {
      return this.$route.name === 'game';
    },

    navPosition() {
      const position = this.settings?.navPosition || 'top';

      return `nav-${position}`;
    },
  },

  watch: {
    sessionExpired(expired) {
      if (expired) this.session_handleExpiredSession();
    },
  },

  async mounted() {
    this.$bus.$on('SELECT_GAME', this.selectGame);
    this.$bus.$on('CLEAR_WALLPAPER', this.clearWallpaperUrl);
    this.$bus.$on('UPDATE_WALLPAPER', this.updateWallpaperUrl);
    this.$bus.$on('BOOT', this.boot);
    this.$bus.$on('UPDATE_BACKGROUND_COLOR', this.updateBackgroundColor);

    this.loading = true;

    await this.$store.dispatch('GET_TWITCH_TOKEN');

    this.init();
  },

  methods: {
    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      this.$bus.$emit('ALERT', { type: 'error', message: 'Error saving settings' });

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bus.$emit('ALERT', { type: 'error', message: 'Error saving settings' });
          this.saving = false;
        });

    },

    clearWallpaperUrl() {
      this.backgroundImageUrl = null;
    },

    updateWallpaperUrl(value) {
      this.backgroundImageUrl = value;
    },

    updateBackgroundColor(value) {
      this.backgroundColor = value;
    },

    handleShortcutAction(data) {
      this.$bus.$emit('HANDLE_SHORTCUT', data);
    },

    init() {
      if (!this.platforms.length) this.loadPlatforms();
      if (this.isPublicRoute && !this.user) return this.loading = false;

      if (this.user) {
        this.boot();
      } else if (this.$route.name !== 'auth') {
        this.$router.replace({ name: 'auth' });
      }
    },

    async loadPlatforms() {
      try {
        await this.$store.dispatch('IGDB', {
          path: 'platforms',
          data: IGDB_QUERIES.PLATFORMS,
          mutation: 'SET_PLATFORMS',
        });
      } catch (e) {
        this.$bvToast.toast('There was an error loading platforms', { variant: 'error' });
      }
    },

    async boot() {
      await this.$store.dispatch('LOAD_BOARDS').catch((e) => {});

      this.loading = false;

      this.$store.dispatch('LOAD_RELEASES').catch((e) => {});
      this.$store.dispatch('LOAD_WALLPAPERS').catch((e) => {});
      this.$store.dispatch('LOAD_SETTINGS').catch((e) => {});
      this.$store.dispatch('LOAD_TAGS').catch((e) => {});
      this.$store.dispatch('LOAD_NOTES').catch((e) => {});
      this.$store.dispatch('LOAD_PROGRESSES').catch((e) => {});
      this.$store.dispatch('LOAD_GAMES').catch((e) => {});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #app {
    background-size: cover;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;

    &.dark {
      background-color: var(--black);
      color: var(--light);
    }

    &.light {
      background-color: var(--white);
    }

    &.nav-bottom {
      flex-direction: column-reverse;
    }

    &.nav-left {
      flex-direction: row;
    }

    &.nav-right {
      justify-content: space-between;
      flex-direction: row-reverse;
    }
  }

  .nav-left, .nav-right {
    .viewport {
      height: 100vh;
      overflow-y: auto;
    }
  }

  // .nav-top, .nav-right {
  //   // background: #cf0;
  // }

  .viewport {
    height: calc(100vh - 72px);
    overflow-y: auto;
    width: 100%;

    // &.game-page {
    //   background: red;
    //   margin-top: -72px;
    // }
  }
</style>
