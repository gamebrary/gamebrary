<template lang="html">
  <div class="auth">
    <div class="loading text-white">
      <div v-if="provider">
        <img
          src="/static/gamebrary-logo.png"
          width="32"
        />

        <i
          class="fas fa-cog fa-spin fa-fw mt-4 mb-2"
          aria-hidden
        />

        <img
          :src="`static/logos/companies/${provider}.svg`"
          alt="Google"
          height="32"
        />
      </div>

      <div v-else>
        <img src="/static/gamebrary-logo.png" />

        <h1 class="lead my-3">Welcome to Gamebrary!</h1>

        <section id="auth" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import 'firebase/auth';

const db = firebase.firestore();

export default {
  computed: {
    ...mapState(['user', 'sessionExpired']),
    ...mapGetters(['darkTheme']),

    provider() {
      return this.$route.params && this.$route.params.provider;
    },
  },

  mounted() {
    if (this.user && this.user.uid) {
      this.$router.replace({ name: 'dashboard' });
    } else {
      this.startAuthUI();
    }
  },

  methods: {
    startAuthUI() {
      const vm = this;
      const authUI = new firebaseui.auth.AuthUI(firebase.auth());

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
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        tosUrl: 'https://gamebrary.com/terms/',
        privacyPolicyUrl: 'https://gamebrary.com/privacy-policy/',
      });
    },

    signInSuccess({ additionalUserInfo, user }) {
      if (additionalUserInfo && additionalUserInfo.isNewUser) {
        this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      }

      if (this.sessionExpired) {
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      this.$store.commit('SET_USER', user);
      this.$router.replace({ name: 'dashboard' });
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
.auth, .loading {
  height: 100vh;
  width: 100vw;
}
.loading {
  // height: 100vh;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0F2027;
  background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);
  background: linear-gradient(to right, #2C5364, #203A43, #0F2027);
}
</style>
