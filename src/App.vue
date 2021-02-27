<!-- TODO: only show save button when data has changed -->
<template>
  <div
    id="app"
    :dir="dir"
    v-shortkey="KEYBOARD_SHORTCUTS"
    @shortkey="handleShortcutAction"
  >
    <dock v-if="user || isPublicRoute" />
    <global-modals />

    <main :class="{
      'authorizing': !user,
      'bg-dark text-white': darkTheme,
      'offset': !isBoard,
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<script>
import Dock from '@/components/Dock';
import GlobalModals from '@/components/GlobalModals';
import firebase from 'firebase/app';
import { mapState, mapGetters } from 'vuex';
import { KEYBOARD_SHORTCUTS, FIREBASE_CONFIG } from '@/constants';
import 'firebase/firestore';

firebase.initializeApp(FIREBASE_CONFIG);

export default {
  name: 'App',

  components: {
    Dock,
    GlobalModals,
  },

  data() {
    return {
      debugUserId: null,
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'sessionExpired']),
    ...mapGetters(['darkTheme']),

    userId() {
      return this.debugUserId || this.user.uid;
    },

    dir() {
      const { settings } = this;

      return settings && settings.language === 'ar' ? 'rtl' : 'ltr';
    },

    isPublicRoute() {
      return this.$route.meta && this.$route.meta.public;
    },

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
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
      } else if (this.$route.name !== 'auth') {
        this.$router.replace({ name: 'auth' });
      }
    },

    loadWallpapers() {
      this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { variant: 'danger' });
        });
    },

    load() {
      const db = firebase.firestore();

      // TODO: move logic to actions
      this.$store.dispatch('LOAD_RELEASES')
        .then((releases) => {
          const [latestRelease] = releases;

          const latestReleaseVersion = latestRelease && latestRelease.tag_name;

          const lastReleaseSeenByUser = (this.settings && this.settings.release) || null;

          if (latestReleaseVersion !== lastReleaseSeenByUser) {
            this.$store.commit('SET_NOTIFICATION', true);
          }
        });

      this.loadWallpapers();
      // TODO: move to actions
      db.collection('settings').doc(this.userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const settings = doc.data();

            this.$store.commit('SET_SETTINGS', settings);
          }
        });

      // TODO: move to actions
      db.collection('tags').doc(this.userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const tags = doc.data();

            this.$store.commit('SET_TAGS', tags);
          }
        });

      // TODO: move to actions
      db.collection('notes').doc(this.userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const notes = doc.data();

            this.$store.commit('SET_NOTES', notes);
          }
        });

      // TODO: move to actions
      db.collection('progresses').doc(this.userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const progresses = doc.data();

            this.$store.commit('SET_PROGRESSES', progresses);
          }
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  main {
    height: 100vh;
    overflow-y: auto;

    &.authorizing {
      width: 100%;
      left: 0;
    }

    &.offset {
      padding-left: calc(58px + .5rem);
    }
  }
</style>
