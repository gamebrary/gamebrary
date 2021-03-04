<template lang="html">
  <b-overlay show no-center no-wrap>
    <template v-slot:overlay>
      <div class="text-center p-4">
        <i class="fas fa-sync fa-spin fa-fw" aria-hidden />
        <p>Please wait...</p>
      </div>
    </template>
  </b-overlay>
</template>

<script>
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';

const db = firebase.firestore();

export default {
  computed: {
    ...mapState(['user']),
  },

  mounted() {
    if (this.user && this.user.uid) {
      return this.$router.replace({ name: 'dashboard' });
    }

    return firebase.auth().getRedirectResult()
      .then(({ additionalUserInfo, user }) => {
        if (additionalUserInfo && additionalUserInfo.isNewUser) {
          this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
        }

        if (user) {
          return this.initUser(user);
        }

        return this.handleAuthRedirect();
      }).catch(() => {});
  },

  methods: {
    initUser(user) {
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.$store.dispatch('LOAD_SETTINGS');
      this.$store.dispatch('LOAD_TAGS');
      this.load();
      this.$router.replace({ name: 'dashboard' });
    },

    handleAuthRedirect() {
      const firebaseAuthProvider = new firebase.auth.GoogleAuthProvider();

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
</style>
