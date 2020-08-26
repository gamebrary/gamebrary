<template lang="html">
  <b-dropdown-item @click="signOut">
    {{ $t('settings.signOut') }}
  </b-dropdown-item>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  methods: {
    signOut() {
      firebase.auth().signOut()
        .then(() => {
          const exitUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://gamebrary.com';

          this.$store.commit('CLEAR_SESSION');
          window.location.href = exitUrl;
        })
        .catch((error) => {
          this.$bvToast.toast(error, { title: 'Error', variant: 'danger' });
        });
    },
  },
};
</script>
