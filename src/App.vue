<!-- TODO: auto scroll to bottom after adding product -->
<!-- TODO: restore rtl -->
<!-- TODO: translate strings -->
<!-- TODO: add markdown wysiwyg -->
<!-- TODO: add help section -->
<!-- TODO: bring notifications back! -->
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
      <page-header />
      <router-view class="viewport pb-5" />
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
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG } from '@/constants';

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
    ...mapState(['user', 'settings', 'sessionExpired']),
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
  },

  watch: {
    sessionExpired(expired) {
      if (expired) this.session_handleExpiredSession();
    },
  },

  async mounted() {
    this.$bus.$on('CLEAR_WALLPAPER', this.clearWallpaperUrl);
    this.$bus.$on('UPDATE_WALLPAPER', this.updateWallpaperUrl);
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
      if (this.isPublicRoute && !this.user) {
        this.loading = false;

        return;
      }

      if (this.user) {
        this.boot();
      } else if (this.$route.name !== 'auth') {
        this.$router.replace({ name: 'auth' });
      }
    },

    async boot() {
      const BOARDS = this.$store.dispatch('LOAD_BOARDS').catch(() => {});
      const RELEASES = this.$store.dispatch('LOAD_RELEASES').catch(() => {});
      const WALLPAPERS = this.$store.dispatch('LOAD_WALLPAPERS').catch(() => {});
      const SETTINGS = this.$store.dispatch('SYNC_LOAD_SETTINGS').catch(() => {});
      const TAGS = this.$store.dispatch('LOAD_TAGS').catch(() => {});
      const NOTES = this.$store.dispatch('SYNC_LOAD_NOTES').catch(() => {});
      const PROGRESSES = this.$store.dispatch('SYNC_LOAD_PROGRESSES').catch(() => {});

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
  }

  .viewport {
    overflow-y: auto;
    height: calc(100vh - 54px);
  }
</style>
