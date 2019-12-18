<template>
  <div
    id="app"
    :class="theme"
    :style="style"
    :dir="dir"
  >
    <nav-header />
    <router-view v-if="user" />
    <authorizing v-else />
    <toast />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import Authorizing from '@/pages/Authorizing';
import Toast from '@/components/Toast';
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
});

const storage = firebase.storage().ref();
const db = firebase.firestore();

export default {
  name: 'App',

  components: {
    NavHeader,
    Authorizing,
    Toast,
  },

  computed: {
    ...mapState(['user', 'platform', 'wallpaperUrl', 'settings']),

    dir() {
      return this.settings && this.settings.language === 'ar'
        ? 'rtl'
        : 'ltr';
    },

    style() {
      return this.$route.name === 'game-board' && this.wallpaperUrl
        ? `background-image: url('${this.wallpaperUrl}')`
        : null;
    },

    customWallpaper() {
      // eslint-disable-next-line
      return this.settings && this.settings.wallpapers && this.platform && this.settings.wallpapers[this.platform.code]
        ? this.settings.wallpapers[this.platform.code].url
        : '';
    },

    theme() {
      const hasPlatform = this.platform && this.platform.code;
      const hasTheme = hasPlatform
      && this.settings
      && this.settings[this.platform.code]
      && this.settings[this.platform.code].theme;

      const isGameBoard = this.$route.name === 'game-board';

      const hasPlatformTheme = hasPlatform && hasTheme;

      return isGameBoard && hasPlatformTheme
        ? `theme-${this.settings[this.platform.code].theme}`
        : 'theme-default';
    },
  },

  watch: {
    customWallpaper(value) {
      if (value) {
        if (this.platform) {
          this.loadWallpaper();
        }
      } else {
        this.$store.commit('SET_WALLPAPER_URL', '');
      }
    },
  },

  mounted() {
    // TODO: REMOVE, call action directly
    this.$bus.$on('SAVE_NOTES', this.saveNotes);
    this.init();
  },

  beforeDestroy() {
    this.$bus.$off('SAVE_NOTES');
  },

  methods: {
    init() {
      if (this.user) {
        this.syncData();
        return;
      }

      if (this.customWallpaper) {
        this.loadWallpaper();
      }

      firebase.auth().getRedirectResult().then(({ additionalUserInfo, user }) => {
        if (additionalUserInfo && additionalUserInfo.isNewUser) {
          this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
        }

        if (user) {
          return this.initUser(user);
        }

        return this.handleAuthRedirect();
      });
    },

    handleAuthRedirect() {
      const authProvider = this.$route.params.authProvider || 'google';

      const firebaseAuthProvider = authProvider === 'twitter'
        ? new firebase.auth.TwitterAuthProvider()
        : new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(firebaseAuthProvider)
        .catch((message) => {
          this.$bus.$emit('TOAST', {
            message,
            type: 'error',
          });
        });
    },

    loadWallpaper() {
      const wallpaperRef = this.customWallpaper;
      this.$store.commit('SET_WALLPAPER_URL', '');

      storage.child(wallpaperRef).getDownloadURL().then((url) => {
        this.$store.commit('SET_WALLPAPER_URL', url);
      });
    },

    saveNotes(notes, force) {
      if (notes) {
        // TODO: move to actions
        db.collection('notes').doc(this.user.uid).set(notes, { merge: !force })
          .then(() => {
            this.$bus.$emit('TOAST', { message: 'Notes updated' });
          })
          .catch(() => {
            this.$bus.$emit('TOAST', { message: 'There was an error saving your note', type: 'error' });
            this.$router.push({ name: 'sessionExpired' });
          });
      }
    },

    syncData() {
      // TODO: track progresses anod notes as well
      // TODO: move to actions
      db.collection('lists').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const gameLists = doc.data();
            this.$store.commit('SET_GAME_LISTS', gameLists);
          }
        });


      // TODO: move to actions
      db.collection('settings').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const settings = doc.data();

            this.$store.commit('SET_SETTINGS', settings);
          }
        });

      // TODO: move to actions
      db.collection('tags').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const tags = doc.data();

            this.$store.commit('SET_TAGS', tags);
          }
        });

      // TODO: move to actions
      db.collection('notes').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const notes = doc.data();

            this.$store.commit('SET_NOTES', notes);
          }
        });

      // TODO: move to actions
      db.collection('progresses').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const progresses = doc.data();

            this.$store.commit('SET_PROGRESSES', progresses);
          }
        });
    },

    initUser(user) {
      this.$store.commit('SET_USER', user);
      this.loadSettings();
      this.loadTags();
      this.loadLists();
      this.syncData();
    },

    loadSettings() {
      // TODO: move to actions
      const docRef = db.collection('settings').doc(this.user.uid);

      docRef.get().then((doc) => {
        const hasData = doc && doc.exists;

        return hasData
          ? this.$store.commit('SET_SETTINGS', doc.data())
          : this.initSettings();
      }).catch(() => {
        this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
        this.$router.push({ name: 'sessionExpired' });
      });
    },

    loadLists() {
      // TODO: move to actions
      db.collection('lists').doc(this.user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.$store.commit('SET_GAME_LISTS', data);
          } else {
            this.initList();
          }
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    loadTags() {
      // TODO: move to actions
      db.collection('tags').doc(this.user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.$store.commit('SET_TAGS', data);
          }
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    initList() {
      // TODO: move to actions
      db.collection('lists').doc(this.user.uid).set({}, { merge: true })
        .then(() => {
          this.loadLists();
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    initSettings() {
      // TODO: move to actions
      db.collection('settings').doc(this.user.uid).set({}, { merge: true })
        .then(() => {
          this.loadSettings();
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import url(https://fonts.googleapis.com/css?family=Fira+Sans:700|Roboto:400,400italic,700);
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  #app {
    background: var(--body-background);
    background-size: cover;
    overflow-x: hidden;
  }
</style>
