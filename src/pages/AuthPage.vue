<template lang="html">
  <div class="auth text-white">
    <img src="/static/gamebrary-logo.png" />
    <h1 class="lead my-3">Welcome to Gamebrary!</h1>

    <b-alert
      v-if="showExpiredAlert"
      variant="warning"
      class="my-2 px-4"
      show
    >
      Your session expired!
    </b-alert>

    <b-spinner
      v-if="loading"
      label="Spinning"
    />

    <section id="auth" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import 'firebase/auth';

const db = firebase.firestore();
const authUI = new firebaseui.auth.AuthUI(firebase.auth());

export default {
  data() {
    return {
      showExpiredAlert: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(['user', 'sessionExpired']),
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.loading = authUI.isPendingRedirect();

      if (this.sessionExpired) {
        this.showExpiredAlert = true;
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      if (this.user && this.user.uid) {
        this.$router.replace({ name: 'home' });
      } else {
        this.startAuthUI();
      }
    },

    startAuthUI() {
      const vm = this;

      authUI.start('#auth', {
        callbacks: {
          signInSuccessWithAuthResult(authResult) {
            vm.signInSuccess(authResult);

            return false;
          },
          signInFailure(message) {
            vm.$bvToast.toast(message, { title: 'Error', variant: 'danger' });
          },
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          // firebase.auth.GithubAuthProvider.PROVIDER_ID,
          // 'apple.com',
          // 'microsoft.com',
          // 'yahoo.com',
          // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        signInSuccessUrl: '',
        tosUrl: 'https://gamebrary.com/terms/',
        privacyPolicyUrl: 'https://gamebrary.com/privacy-policy/',
      });
    },

    signInSuccess({ additionalUserInfo, user }) {
      this.loading = true;

      if (additionalUserInfo && additionalUserInfo.isNewUser) {
        this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      }

      if (this.sessionExpired) {
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      this.$store.commit('SET_USER', user);
      this.$router.replace({ name: 'home' });
      this.load();
    },

    loadWallpapers() {
      this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { variant: 'danger' });
        });
    },

    load() {
      this.$store.dispatch('LOAD_RELEASES')
        .then((releases) => {
          // TODO: move this logic to the action
          const [latestRelease] = releases;

          const latestReleaseVersion = latestRelease && latestRelease.tag_name;

          const lastReleaseSeenByUser = (this.settings && this.settings.release) || null;

          if (latestReleaseVersion !== lastReleaseSeenByUser) {
            this.$store.commit('SET_NOTIFICATION', true);
          }
        });

      this.loadWallpapers();

      // TODO: move all to actions, consider making live update optional? if it gets expensive $$$
      db.collection('settings').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const settings = doc.data();

            this.$store.commit('SET_SETTINGS', settings);
          }
        });

      db.collection('tags').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const tags = doc.data();

            this.$store.commit('SET_TAGS', tags);
          }
        });

      db.collection('notes').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const notes = doc.data();

            this.$store.commit('SET_NOTES', notes);
          }
        });

      db.collection('progresses').doc(this.user.uid)
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

<style lang="scss" rel="stylesheet/scss" scoped>
.auth {
  height: 100vh;
  margin: 5rem auto 0;
  color: white;
  flex-direction: column;
  text-align: center;
  display: flex;
  align-items: center;
}
</style>
