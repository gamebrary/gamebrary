<template>
  <div
    id="app"
    class="mvh-100 d-flex flex-column"
    :dir="dir"
  >
    <page-header />
    <router-view v-if="user" />
    <authorizing v-else />
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import Authorizing from '@/pages/Authorizing';
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import 'firebase/auth';
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
    PageHeader,
    Authorizing,
  },

  data() {
    return {
      debugUserId: null,
    };
  },

  computed: {
    ...mapState(['user', 'wallpaperUrl', 'settings']),

    userId() {
      return this.debugUserId || this.user.uid;
    },

    dir() {
      return this.settings && this.settings.language === 'ar'
        ? 'rtl'
        : 'ltr';
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (this.user) {
        this.syncData();
        return;
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
          this.$bvToast.toast(message, { title: 'Error', variant: 'danger' });
        });
    },

    loadWallpapers() {
      this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { title: 'Error', variant: 'danger' });
        });
    },

    syncData() {
      this.$store.dispatch('LOAD_RELEASES');
      this.loadWallpapers();

      // TODO: track progresses as well
      // TODO: move to actions
      db.collection('lists').doc(this.userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const gameLists = doc.data();
            this.$store.commit('SET_GAME_LISTS_LEGACY', gameLists);
          }
        });


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

    initUser(user) {
      this.$store.commit('SET_USER', user);
      this.loadSettings();
      this.loadTags();
      this.loadLists();
      this.syncData();
    },

    loadSettings() {
      // TODO: move to actions
      const docRef = db.collection('settings').doc(this.userId);

      docRef.get().then((doc) => {
        const hasData = doc && doc.exists;

        return hasData
          ? this.$store.commit('SET_SETTINGS', doc.data())
          : this.initSettings();
      }).catch(() => {
        this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
        this.$router.push({ name: 'sessionExpired' });
      });
    },

    loadLists() {
      // TODO: move to actions
      db.collection('lists').doc(this.userId).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.$store.commit('SET_GAME_LISTS_LEGACY', data);
          } else {
            this.initList();
          }
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    loadTags() {
      // TODO: move to actions
      db.collection('tags').doc(this.userId).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.$store.commit('SET_TAGS', data);
          }
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    initList() {
      // TODO: move to actions
      db.collection('lists').doc(this.userId).set({}, { merge: true })
        .then(() => {
          this.loadLists();
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    initSettings() {
      // TODO: move to actions
      db.collection('settings').doc(this.userId).set({}, { merge: true })
        .then(() => {
          this.loadSettings();
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #app {
    // display: flex;
    // flex-direction: column;
    // min-height: 100vh;
  }
</style>
