<!-- TODO: Use moment? or use dayjs without wrapper -->
<!-- TODO: remove toasts -->
<!-- TODO: add mega search shift + k -->
<!-- TODO: re-translate strings -->
<!-- TODO: upgrade firebase to latest -->
<!-- TODO: Refactor tags architecture -->
<!-- TODO: button things up and prepare for deploy -->
<!-- TODO: focus on affiliate stuff -->
<!-- TODO: put focus on open source -->
<!-- TODO: restore game actions and clean up everything -->
<!-- TODO: update email template, update logo, etc... -->
<!-- TODO: use navigator.onLine -->
<!-- TODO: integrate itch.io -->
<!-- TODO: integrate fandom/wikia -->
<!-- TODO: https://zelda.fandom.com/api/v1/Articles/List?expand=1&category=Characters&limit=10000 -->
<!-- TODO: parse wikipedia article into sections, get article images, links, etc... -->
<!-- TODO: itch.io referral https://itch.io/register?return_to=https%3A%2F%2Fitch.io%2Fpartners%2Fapplication -->
<!-- use name to search, make sure it matches slug -->
<template>
  <div
    id="app"
    :dir="dir"
    v-shortkey="KEYBOARD_SHORTCUTS"
    :style="style"
    :class="{ 'no-repeat': style.length > 0 }"
    @shortkey="handleShortcutAction"
  >
    <div :class="{ 'blurred': isGamePage }">
      <page-header />
      <router-view class="viewport" />
      <auth-modal />
      <keyboard-shortcuts-modal />
      <add-remove-game />
    </div>
  </div>
</template>

<script>
import AuthModal from '@/components/AuthModal';
import AddRemoveGame from '@/components/AddRemoveGame';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import PageHeader from '@/components/PageHeader';
import sessionMixin from '@/mixins/sessionMixin';
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG } from '@/constants';

firebase.initializeApp(FIREBASE_CONFIG);

export default {
  name: 'App',

  components: {
    PageHeader,
    AuthModal,
    AddRemoveGame,
    KeyboardShortcutsModal,
  },

  mixins: [sessionMixin],

  data() {
    return {
      debugUserId: null,
      backgroundImageUrl: null,
      backgroundColor: null,
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'sessionExpired']),

    style() {
      const backgroundImage = ['game', 'board'].includes(this.$route?.name) && this.backgroundImageUrl
        ? `background-image: url('${this.backgroundImageUrl}');`
        : null;

      const backgroundColor = this.backgroundColor
        ? `background-color: ${this.backgroundColor};`
        : null;

      return [backgroundImage, backgroundColor].join('');
    },

    userId() {
      return this.debugUserId || this.user.uid;
    },

    dir() {
      const { settings } = this;

      return settings && settings.language === 'ar' ? 'rtl' : 'ltr';
    },

    isPublicRoute() {
      return this.$route.meta?.public;
    },

    isGamePage() {
      return this.$route.name === 'game';
    },

    isBoard() {
      return ['public.board', 'board'].includes(this.$route.name);
    },
  },

  watch: {
    sessionExpired(expired) {
      if (expired) this.session_handleExpiredSession();
    },
  },

  async mounted() {
    this.$bus.$on('UPDATE_WALLPAPER', this.updateWallpaperUrl);
    this.$bus.$on('UPDATE_BACKGROUND_COLOR', this.updateBackgroundColor);

    await this.$store.dispatch('GET_TWITCH_TOKEN');

    this.init();
  },

  methods: {
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
      this.$store.dispatch('LOAD_IGDB_PLATFORMS');

      if (this.isPublicRoute) {
        return;
      }

      if (this.user) {
        this.boot();
      } else if (this.$route.name !== 'auth' && !this.$route.params.providerId) {
        this.$router.replace({ name: 'auth' });
      }
    },

    boot() {
      this.$store.dispatch('LOAD_BOARDS');
      this.$store.dispatch('LOAD_RELEASES');
      this.$store.dispatch('LOAD_WALLPAPERS');
      this.$store.dispatch('SYNC_LOAD_SETTINGS');
      this.$store.dispatch('LOAD_TAGS');
      this.$store.dispatch('SYNC_LOAD_NOTES');
      this.$store.dispatch('SYNC_LOAD_PROGRESSES');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";

  .blurred {
    backdrop-filter: blur(25px);
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #app {
    min-height: 100vh;
    display: grid;

    &.no-repeat {
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .viewport {
    min-height: calc(100vh - 62px);
  }
</style>
