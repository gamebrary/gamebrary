<template>
  <div
    id="app"
    :dir="dir"
    :class="`dock-${dockPosition}`"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <dock />

    <main :class="{
      'authorizing': !user,
      'is-board': isBoard,
      }"
    >
      <global-modals />
      <router-view />
    </main>
  </div>
</template>

<script>
import Dock from '@/components/Dock';
import GlobalModals from '@/components/GlobalModals';
import sessionMixin from '@/mixins/sessionMixin';
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG } from '@/constants';

firebase.initializeApp(FIREBASE_CONFIG);

export default {
  name: 'App',

  components: {
    Dock,
    GlobalModals,
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

    dockPosition() {
      return this.settings && this.settings.dockPosition;
    },

    isPublicRoute() {
      return this.$route.meta && this.$route.meta.public;
    },

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
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
  main {
    overflow-y: auto;
    height: calc(100vh - 54px);

    &.authorizing {
      height: 100vh;
      width: 100%;
      left: 0;
    }

    &.is-board {
      height: 100vh;
    }
  }

  .dock-left,
  .dock-right {
    height: 100vh;
    display: grid;
    grid-template-columns: 66px auto;
  }

  .dock-right {
    grid-template-columns: auto 66px;

    main {
      grid-row: 1;
    }
  }

  .dock-bottom {
    display: flex;
    flex-direction: column-reverse;

    main {
      justify-content: flex-end;
    }
  }
</style>
