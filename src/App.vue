<template>
  <body
    id="app"
    :class="bodyClasses"
    :style="style"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <b-spinner v-if="loading" class="spinner-centered mt-5" />

    <template v-else>
      <portal-target name="root"/>
      <PageHeader v-if="showPageDock" />
      <router-view class="viewport" />
      <KeyboardShortcutsModal />
      <markdown-cheatsheet />

      <template v-if="user">
        <EditTagSidebar />
        <CreateBoardSidebar />
        <CreateTagSidebar />
        <GameSelectorSidebar />
        <EditBoardSidebar />
        <MainSidebar />
        <WallpaperDetailsSidebar />
      </template>
    </template>
  </body>
</template>

<script>
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
import GameSelectorSidebar from '@/components/GameSelectorSidebar';
import EditBoardSidebar from '@/components/EditBoardSidebar';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import PageHeader from '@/components/PageHeader';
import MainSidebar from '@/components/MainSidebar';
import WallpaperDetailsSidebar from '@/components/WallpaperDetailsSidebar';
import EditTagSidebar from '@/components/EditTagSidebar'
import CreateBoardSidebar from '@/components/CreateBoardSidebar'
import CreateTagSidebar from '@/components/CreateTagSidebar'
import { mapState, mapGetters } from 'vuex';
import { KEYBOARD_SHORTCUTS, IGDB_QUERIES } from '@/constants';

export default {
  name: 'App',

  components: {
    PageHeader,
    MainSidebar,
    EditTagSidebar,
    CreateBoardSidebar,
    CreateTagSidebar,
    MarkdownCheatsheet,
    KeyboardShortcutsModal,
    WallpaperDetailsSidebar,
    GameSelectorSidebar,
    EditBoardSidebar,
  },

  data() {
    return {
      loading: false,
      hasScroll: false,
      debugUserId: null,
      backgroundImageUrl: null,
      backgroundColor: null,
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'sessionExpired', 'platforms', 'games', 'gameSelectorData']),
    ...mapGetters(['darkTheme', 'navPosition']),

    bodyClasses() {
      return [
        this.$route.name,
        `nav-${this.navPosition}`,
        {
          'has-scroll': this.hasScroll,
          'dark text-light': this.darkTheme,
          'bg-black': !this.backgroundColor && this.darkTheme,
          'bg-light': !this.backgroundColor && !this.darkTheme,
        }
      ]
    },

    showPageDock() {
      if (['auth', 'home'].includes(this.$route.name) && !this.user) return false;

      return Boolean(this.user) || this.isPublicRoute;
    },

    style() {
      const backgroundImage = ['game', 'board', 'profile', 'public.profile'].includes(this.$route?.name) && this.backgroundImageUrl
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
      if (!expired) return;

      this.$store.commit('CLEAR_SESSION');
      this.$router.replace({ name: 'auth' });
    },
  },

  async mounted() {
    this.$bus.$on('LIKE_UNLIKE_GAME', this.likeOrUnlikeGame);
    this.$bus.$on('CLEAR_WALLPAPER', this.clearWallpaperUrl);
    this.$bus.$on('UPDATE_WALLPAPER', this.updateWallpaperUrl);
    this.$bus.$on('BOOT', this.boot);
    this.$bus.$on('UPDATE_BACKGROUND_COLOR', this.updateBackgroundColor);

    this.loading = true;

    await this.$store.dispatch('GET_TWITCH_TOKEN');

    this.init();
  },

  methods: {
    async likeOrUnlikeGame(gameId) {
      try {
        const isLiked = this.games?.[gameId];
        const mutation = isLiked ? 'UNLIKE_GAME' : 'LIKE_GAME';

        this.$store.commit(mutation, gameId);

        await this.$store.dispatch('SAVE_GAMES');

      } catch (e) {
        //
      }
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
      this.$store.dispatch('LOAD_PROFILE').catch((e) => {});
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
    background-size: cover;
    background-attachment: fixed;
    background-position: top;
    height: 100svh;
    overflow-y: auto;

    &.nav-top {
      padding-top: 65px;

      .viewport {
        height: calc(100svh - 80px);
      }
    }

    .viewport {
      padding: .5rem 1rem;
      width: 100%;
      s
      &.board {
        height: calc(100svh - 65px);
        overflow-y: hidden;
      }
    }
  }
</style>
