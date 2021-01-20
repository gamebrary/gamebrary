<template>
  <div
    id="app"
    :dir="dir"
  >
    <dock v-if="user" />

    <main
      :class="{ 'authorizing': !user,
        'bg-dark text-white': nightMode,
        }"
    >
      <router-view />
    </main>
    <session-expired v-if="user" />
    <game-modal />
  </div>
</template>

<script>
import Dock from '@/components/Dock';
import SessionExpired from '@/components/SessionExpired';
import GameModal from '@/components/Game/GameModal';
import firebase from 'firebase/app';
import { mapState, mapGetters } from 'vuex';
import 'firebase/firestore';

// TODO: store in env vars
firebase.initializeApp({
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
});

const db = firebase.firestore();

export default {
  name: 'App',

  components: {
    Dock,
    GameModal,
    SessionExpired,
  },

  data() {
    return {
      debugUserId: null,
    };
  },

  computed: {
    ...mapState(['user', 'wallpaperUrl', 'settings', 'sessionExpired']),
    ...mapGetters(['nightMode']),

    userId() {
      return this.debugUserId || this.user.uid;
    },

    dir() {
      // TODO: find out all rtl languages and store in const
      return this.settings && this.settings.language === 'ar'
        ? 'rtl'
        : 'ltr';
    },

    isPublicBoard() {
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
    init() {
      if (this.isPublicBoard) {
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
      // TODO: remove onSnapshot? May get costly $$$
      // TODO: track progresses as well

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
      padding-left: 55px;
    }
  }
</style>
