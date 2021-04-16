import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  computed: {
    session_publicSiteUrl() {
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://gamebrary.com';
    },

    session_authUrl() {
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://app.gamebrary.com';
    },
  },

  methods: {
    session_signOut() {
      firebase.auth().signOut()
        .then(() => {
          this.$store.commit('CLEAR_SESSION');
          window.location.href = this.session_publicSiteUrl;
        })
        .catch((error) => {
          this.$bvToast.toast(error, { title: 'Error', variant: 'danger' });
        });
    },
  },
};
