import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  methods: {
    session_signOut() {
      firebase.auth().signOut()
        .then(() => {
          this.session_handleExpiredSession();
        })
        .catch((error) => {
          this.$bvToast.toast(error, { title: 'Error', variant: 'danger' });
        });
    },

    session_handleExpiredSession() {
      this.$store.commit('CLEAR_SESSION');
      this.$router.replace({ name: 'auth' });
    },
  },
};
