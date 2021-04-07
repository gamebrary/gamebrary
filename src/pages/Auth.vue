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

        <b-button
          v-for="provider in AUTH_PROVIDERS"
          variant="light"
          block
          :to="{ name: 'auth-provider', params: { provider }}"
          :key="`provider-${provider}`"
        >
          <img
            :src="`static/logos/companies/${provider}.svg`"
            alt="Google"
            height="26"
          />

          <span class="text-capitalize">Login with {{ provider }}</span>
        </b-button>

        <p class="mt-3 small">More providers coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import { AUTH_PROVIDERS } from '@/constants';
import 'firebase/auth';

const db = firebase.firestore();

export default {
  data() {
    return {
      AUTH_PROVIDERS,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme']),

    provider() {
      return this.$route.params && this.$route.params.provider;
    },
  },

  watch: {
    provider(value) {
      if (value) {
        this.redirect(value);
      }
    },
  },

  mounted() {
    if (this.user && this.user.uid) {
      this.$router.replace({ name: 'dashboard' });
    } else {
      this.checkAuthRedirectResult();
    }
  },

  methods: {
    checkAuthRedirectResult() {
      firebase.auth().getRedirectResult()
        .then(({ additionalUserInfo, user }) => {
          if (additionalUserInfo && additionalUserInfo.isNewUser) {
            this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
          }

          // console.log(additionalUserInfo);
          // console.log('save this?');

          if (user) {
            this.initUser(user);
          } else {
            this.redirect(additionalUserInfo.providerId);
          }
        }).catch(() => {});
    },

    redirect(provider) {
      switch (provider) {
      case 'google': this.loginWithGoogle(); break;
      // case 'github': this.loginWithGithub(); break;
      default: this.$router.replace({ name: 'auth' }); break;
      }
    },

    initUser(user) {
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.$store.dispatch('LOAD_SETTINGS');
      this.$store.dispatch('LOAD_TAGS');
      this.load();
      this.$router.replace({ name: 'dashboard' });
    },

    loginWithGoogle() {
      const firebaseAuthProvider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(firebaseAuthProvider)
        .catch((message) => {
          this.$bvToast.toast(message, { title: 'Error', variant: 'danger' });
        });
    },

    loginWithGithub() {
      const firebaseAuthProvider = new firebase.auth.GithubAuthProvider();

      firebase.auth().signInWithRedirect(firebaseAuthProvider)
        .catch((message) => {
          this.$bvToast.toast(message, { title: 'Error', variant: 'danger' });
        });
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
          const [latestRelease] = releases;

          const latestReleaseVersion = latestRelease && latestRelease.tag_name;

          const lastReleaseSeenByUser = (this.settings && this.settings.release) || null;

          if (latestReleaseVersion !== lastReleaseSeenByUser) {
            this.$store.commit('SET_NOTIFICATION', true);
          }
        });

      this.loadWallpapers();

      // TODO: track progresses as well
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
