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
    @shortkey="handleShortcutAction"
  >
    <page-header />
    <router-view class="viewport" />
    <auth-modal />
    <keyboard-shortcuts-modal />
    <add-remove-game />
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
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'sessionExpired']),

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
    await this.$store.dispatch('GET_TWITCH_TOKEN');

    this.init();
  },

  methods: {
    handleShortcutAction(data) {
      this.$bus.$emit('HANDLE_SHORTCUT', data);
    },

    init() {
      this.$store.dispatch('LOAD_IGDB_PLATFORMS');

      if (this.isPublicRoute) {
        return;
      }

      if (this.user) {
        this.load();
      } else if (this.$route.name !== 'auth' && !this.$route.params.providerId) {
        this.$router.replace({ name: 'auth' });
      }
    },

    load() {
      this.$store.dispatch('LOAD_BOARDS');
      this.$store.dispatch('LOAD_RELEASES');
      this.$store.dispatch('LOAD_WALLPAPERS');
      this.$store.dispatch('SYNC_LOAD_SETTINGS');
      this.$store.dispatch('SYNC_LOAD_TAGS');
      this.$store.dispatch('SYNC_LOAD_NOTES');
      this.$store.dispatch('SYNC_LOAD_PROGRESSES');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #app {
    // background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 100%);
    min-height: 100vh;
    display: grid;
  }

  .viewport {
    // padding-top: 54px !important;
    overflow-y: auto;
    // height: calc(100vh - 54px);
  }
</style>
