<template lang="html">
  <b-overlay show no-center no-wrap>
    <template v-slot:overlay>
      <div class="text-center p-4">
        <b-icon-arrow-clockwise font-scale="3" animation="spin" />
        <p id="cancel-label">Please wait...</p>
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

    return firebase.auth().getRedirectResult().then(({ additionalUserInfo, user }) => {
      if (additionalUserInfo && additionalUserInfo.isNewUser) {
        this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      }

      if (user) {
        return this.initUser(user);
      }

      return this.handleAuthRedirect();
    });
  },

  methods: {
    initUser(user) {
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.loadSettings();
      this.loadTags();
      this.loadLists();
      this.load();
      this.$router.replace({ name: 'dashboard' });
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
        this.$store.commit('SET_SESSION_EXPIRED', true);
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
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },

    loadLists() {
      // TODO: move to actions
      db.collection('lists').doc(this.user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.$store.commit('SET_GAME_LISTS_LEGACY', data);
          } else {
            this.initList();
          }
        })
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
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
          this.$bvToast.toast('There was an error loading wallpapers', { title: 'Error', variant: 'danger' });
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
      db.collection('lists').doc(this.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const gameLists = doc.data();
            this.$store.commit('SET_GAME_LISTS_LEGACY', gameLists);
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
