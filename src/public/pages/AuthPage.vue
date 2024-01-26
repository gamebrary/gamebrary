<template lang="html">
  <section>
    <b-container class="field centered text-center">
      <h3 class="mt-5">Welcome to Gamebrary</h3>

      <b-alert
        class="mx-auto text-center"
        :show="showExpiredAlert"
        style="width: 220px"
        variant="warning"
      >
        Session expired
      </b-alert>

      <b-form-input
        v-model="email"
        id="email"
        type="email"
        placeholder="Email"
      />

      <b-form-input
        v-model="password"
        id="password"
        type="password"
        placeholder="Password"
      />

      <div class="d-flex justify-content-between">
        <b-button @click="createAccount">
          <b-spinner v-if="loading" small />
          <template v-else>Create account</template>
        </b-button>

        <b-button @click="loginWithEmail">
          <b-spinner v-if="loading" small />
          <template v-else>Login</template>
        </b-button>
      </div>
      
      <b-button @click="loginWithGoogle" variant="text" class="p-0">
        <img src="img/google-sign-in-button-light.svg" alt="Login with Google">
      </b-button>



      <section v-show="!loading" id="auth" class="py-2" />
    </b-container>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";

import { FIREBASE_CONFIG } from '@/constants';
import { mapState } from 'vuex';

const app = initializeApp(FIREBASE_CONFIG);

export default {
  data() {
    return {
      showExpiredAlert: false,
      loading: false,
      email: '',
      password: '',
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
      console.log('sessionExpired', this.sessionExpired);
      if (this.sessionExpired) {
        console.log('sessionExpired', this.sessionExpired);
        this.showExpiredAlert = true;
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      this.getGoogleRedirectResult();
    },

    createAccount() {
      this.loading = true;
      const auth = getAuth(app);

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log('userCredential', userCredential);
          const user = userCredential?.user;

          this.$store.commit('SET_SESSION_EXPIRED', false);
          this.$store.commit('SET_USER', user);
          this.$router.push({ name: 'home' });
        })
        .catch((error) => {
          this.handleError(error.code)
          this.loading = false;
        });
    },

    loginWithEmail() {
      this.loading = true;
      const auth = getAuth(app);

      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(({ user }) => {
          this.signInSuccess(user)
        })
        .catch((error) => {
          this.handleError(error.code)
          this.loading = false;
        });
    },

    loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          console.log('result', result);
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          console.log('token', token)
          // The signed-in user info.
          const user = result.user;
          console.log('user', user)
          this.signInSuccess(user);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);

          console.log(error);
          console.log(email);
          console.log(credential);
          // ...
        });
    },

    getGoogleRedirectResult() {
      const auth = getAuth();

      getRedirectResult(auth)
        .then((result) => {
          console.log('getRedirectResult', result);
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log('credential', credential);
          const token = credential.accessToken;

          console.log('token', token);

          // The signed-in user info.
          const user = result.user;

          console.log('user', user)
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },

    handleError(errorCode) {
      if (errorCode === 'auth/email-already-in-use') this.$bvToast.toast('Email already in use');
      if (errorCode === 'auth/wrong-password') this.$bvToast.toast('Wrong password');
    },

    signInSuccess(user) {
      this.loading = true;

      // if (additionalUserInfo?.isNewUser) this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.$router.push({ name: 'home' });
      this.$bus.$emit('BOOT');
    },
  },
};
</script>
