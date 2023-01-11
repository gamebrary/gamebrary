<!-- TODO: finish speedruns -->
<!-- TODO: add parental controls (filter out erotic games) -->
<!-- TODO: deku deals integration https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frsshub.app%2Fdekudeals%2Fmost-wanted -->
<!-- TODO: use https://github.com/twitchtv/igdb-api-node -->
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
<template>
  <main
    id="app"
    :class="darkTheme ? 'dark' : 'light'"
    v-shortkey="KEYBOARD_SHORTCUTS"
    :style="style"
    @shortkey="handleShortcutAction"
  >
    <b-spinner v-if="loading" class="spinner-centered mt-5" />

    <template v-else>
      <div v-b-visible.54="visibleHandler" class="header-flag" />
      <page-header />
      <side-bar v-if="user" />
      <router-view :class="['viewport', { offset }]" />
      <keyboard-shortcuts-modal />
      <markdown-cheatsheet />
    </template>
  </main>
</template>

<script>
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import PageHeader from '@/components/PageHeader';
import SideBar from '@/components/SideBar';
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
    SideBar,
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

    offset() {
      return !['home'].includes(this.$route.name);
    },
  },

  watch: {
    sessionExpired(expired) {
      if (expired) this.session_handleExpiredSession();
    },
  },

  async mounted() {
    this.$bus.$on('CLEAR_WALLPAPER', this.clearWallpaperUrl);
    this.$bus.$on('UPDATE_WALLPAPER', this.updateWallpaperUrl);
    this.$bus.$on('BOOT', this.boot);
    this.$bus.$on('UPDATE_BACKGROUND_COLOR', this.updateBackgroundColor);

    this.loading = true;

    await this.$store.dispatch('GET_TWITCH_TOKEN');

    this.init();
  },

  methods: {
    visibleHandler(visible) {
      if (!['game', 'board'].includes(this.$route.name)) this.$store.commit('SET_SCROLLED', !visible);
    },

    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
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
      const BOARDS = this.$store.dispatch('LOAD_BOARDS').catch(() => {});
      const RELEASES = this.$store.dispatch('LOAD_RELEASES').catch(() => {});
      const WALLPAPERS = this.$store.dispatch('LOAD_WALLPAPERS').catch(() => {});
      const SETTINGS = this.$store.dispatch('LOAD_SETTINGS').catch(() => {});
      const TAGS = this.$store.dispatch('LOAD_TAGS').catch(() => {});
      const NOTES = this.$store.dispatch('LOAD_NOTES').catch(() => {});
      const PROGRESSES = this.$store.dispatch('LOAD_PROGRESSES').catch(() => {});

      await Promise.allSettled([BOARDS, RELEASES, WALLPAPERS, SETTINGS, TAGS, NOTES, PROGRESSES]);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #app {
    min-height: 100vh;
    display: grid;
    background-size: cover;
    background-attachment: fixed;

    &.dark {
      background-color: var(--black);
      color: var(--light);
    }

    &.light {
      background-color: var(--white);
    }
  }

  .viewport {
    min-height: 100vh;
    overflow-y: auto;

    &.offset {
      padding: 54px 0;
    }
  }

  .header-flag {
    background: transparent;
    height: 0;
  }
</style>
