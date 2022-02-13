<!-- TODO: add optional chaining -->
<!-- TODO: use navigator.onLine -->
<!-- TODO: integrate itch.io -->
<!-- TODO: integrate fandom/wikia -->
<!-- TODO: https://zelda.fandom.com/api/v1/Articles/List?expand=1&category=Characters&limit=10000 -->
<!-- TODO: parse wikipedia article into sections, get article images, links, etc... -->
<!-- TODO: itch.io referral https://itch.io/register?return_to=https%3A%2F%2Fitch.io%2Fpartners%2Fapplication -->
<!-- TODO: GOG api https://embed.gog.com//games/ajax/filtered?mediaType=game&slug=Little%20Big%20Adventure -->
<!-- use name to search, make sure it matches slug -->
<template>
  <div
    id="app"
    :dir="dir"
    :class="`dock-${dockPosition}`"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <dock v-if="user" />
    <public-dock v-else />

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
import PublicDock from '@/components/PublicDock';
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
    PublicDock,
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
    height: 100vh;

    main {
      height: 100vh;
    }
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
