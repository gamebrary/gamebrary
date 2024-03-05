<!-- TODO: add features page -->
<!-- TODO: integrate with keap -->
<!-- TODO: make all components pascal case -->
<!-- TODO: hook up remaining status indicator places -->
<template>
  <main
    id="app"
    :class="[!backgroundColor && darkTheme ? 'dark bg-black text-light' : 'light', `nav-${navPosition}`]"
    :style="style"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <b-spinner v-if="loading" class="spinner-centered mt-5" />

    <template v-else>
      <page-header />
      <router-view class="viewport" />
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
import { initializeApp } from "firebase/app";
import { mapState, mapGetters } from 'vuex';
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG, IGDB_QUERIES } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);

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
    ...mapState(['user', 'settings', 'sessionExpired', 'platforms', 'games']),
    ...mapGetters(['darkTheme', 'isVerticalNav', 'navPosition']),

    style() {
      const backgroundImage = ['game', 'board', 'profile'].includes(this.$route?.name) && this.backgroundImageUrl
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
    async selectGame(gameId) {
      try {
        const isLiked = this.games?.[gameId];
        const mutation = isLiked ? 'UNLIKE_GAME' : 'LIKE_GAME';
        const message = isLiked ? 'Game removed from your favorites' : 'Game added to your favorites';

        this.$store.commit(mutation, gameId);

        await this.$store.dispatch('SAVE_GAMES');

        this.$bvToast.toast(message);
      } catch (e) {
        console.log('err' ,e);
      }
    },

    clearWallpaperUrl() {
      this.backgroundImageUrl = null;
    },

    updateWallpaperUrl(value) {
      console.log('updateWallpaperUrl', value);
      this.backgroundImageUrl = value;
    },

    updateBackgroundColor(value) {
      this.backgroundColor = value;
    },

    handleShortcutAction(data) {
      this.$bus.$emit('HANDLE_SHORTCUT', data);
    },

    init() {
      if (!this.platforms?.length) this.loadPlatforms();
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
    display: flex;
    background-size: contain;
    background-attachment: fixed;
    height: 100svh;
    // background-repeat: no-repeat;

    // test
    max-height: 100svh;
    overflow-y: auto;
    // end test

    &.nav-top {
      padding-top: 65px;

      .viewport {
        height: calc(100svh - 65px);
      }
    }

    .viewport {
      height: 100svh;
      padding: .5rem 1rem;
      width: 100%;
    }

    &.light {
      background-color: #f3f3f3;
    }

    &.nav-bottom {
      flex-direction: column-reverse;
    }

    &.nav-left {
      flex-direction: row;
      
      .viewport {
        padding-left: 85px;
      }
    }

    &.nav-right {
      justify-content: space-between;
      flex-direction: row-reverse;
      
      .viewport {
        padding-right: 85px;
      }
    }

    &.nav-left, &.nav-right {
      .viewport {
        height: 100svh;
        overflow-y: auto;
      }
    }
  }
</style>
