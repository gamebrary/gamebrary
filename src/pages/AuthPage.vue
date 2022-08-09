<template lang="html">
  <b-container>
    <portal to="headerTitle">Login</portal>

    <b-alert
      class="mx-auto text-center"
      :show="showExpiredAlert"
      style="width: 220px"
      variant="warning"
    >
      Session expired
    </b-alert>

    <section id="auth" />
  </b-container>
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

      if (this.user?.uid) {
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
      console.log('signInSuccess');
      this.loading = true;

      if (additionalUserInfo?.isNewUser) {
        this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      }

      if (this.sessionExpired) {
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      console.log(user);
      console.log(additionalUserInfo);

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

    async load() {
      await this.$store.dispatch('LOAD_RELEASES');

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
