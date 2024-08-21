<template lang="html">
  <div class="mx-auto" style="max-width: 420px">
    <div class="text-center mb-3">
      <img
        src="/logo.png"
        alt=""
        height="100"
        class="mb-3"
      />

      <h3>Welcome to Gamebrary</h3>
    </div>

    <p class="small">
      {{ authDescription }}
      <b-link @click="newUser = !newUser">{{ authAction }}</b-link>
    </p>

    <b-alert
      :show="showExpiredAlert || Boolean(errorCode)"
      variant="danger"
    >
      <template v-if="showExpiredAlert">
        Session expired
      </template>
      
      <template v-else>
        {{ errorMessage }}
      </template>
    </b-alert>

    <b-form
      @submit.prevent="submit"
      class="bg-dangers"
    >
      <b-form-input
        v-model="email"
        id="email"
        type="email"
        class="mb-3"
        required
        autocomplete="email"
        placeholder="Email"
      />

      <b-form-input
        v-model="password"
        class="mb-3"
        id="password"
        type="password"
        required
        autocomplete="new-password"
        placeholder="Password"
      />

      <b-button
        type="submit"
        :variant="darkTheme ? 'success' : 'primary'"
      >
        <b-spinner v-if="loading" small />
        <template v-else>
          {{ newUser ? 'Create account' : 'Login' }}
        </template>
      </b-button>

      <br />

      <b-button
        variant="text"
        class="mt-3 p-0"
        @click="loginWithGoogle"
      >
        <img
          :src="`img/google-sign-${newUser ? 'up' : 'in'}-button-light.svg`"
          alt="Sign in with Google"
        />
      </b-button>
    </b-form>
  </div>
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
import { mapState, mapGetters } from 'vuex';

const app = initializeApp(FIREBASE_CONFIG);

export default {
  data() {
    return {
      showExpiredAlert: false,
      loading: false,
      email: '',
      password: '',
      newUser: false,
      errorCode: null,
    };
  },

  computed: {
    ...mapState(['user', 'sessionExpired']),
    ...mapGetters(['darkTheme']),

    authDescription() {
      return this.newUser
        ? 'Already have an account?'
        : 'Need an account?';
    },

    authAction() {
      return this.newUser
        ? 'Login'
        : 'Create account';
    },

    errorMessage() {
      if (!this.errorCode) return null;
      if (this.errorCode === 'auth/email-already-in-use') return 'Email already in use';
      if (this.errorCode === 'auth/wrong-password') return 'Wrong password';
      if (this.errorCode === 'auth/user-not-found') return 'User not found';
      if (this.newUser) return 'Error creating your account';
      
      return 'Error logging in';
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    submit() {
      this.loading = true;

      if (this.newUser) {
        this.createAccount();
      } else {
        this.loginWithEmail();
      }
    },

    init() {
      if (this.sessionExpired) {
        this.showExpiredAlert = true;
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      this.getGoogleRedirectResult();
    },

    async createAccount() {
      const auth = getAuth(app);

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          this.$store.commit('SET_SESSION_EXPIRED', false);
          this.$store.commit('SET_USER', userCredential?.user);
          this.$router.replace({ name: 'boards' });
          // TODO: Move to actions, add contact to crm, save user id and metadata
        })
        .catch((error) => {
          this.handleError(error?.code);
        });
    },

    async loginWithEmail() {
      try {
        const auth = getAuth(app);

        const data = await signInWithEmailAndPassword(auth, this.email, this.password);

        this.signInSuccess(data.user);
      } catch (error) {
        this.handleError(error?.code);
      }
    },

    loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          // TODO: clean this up, inspect data available, save as needed
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // console.log('token', token)
          // The signed-in user info.
          const user = result.user;
          // console.log('user', user)
          this.signInSuccess(user);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // // Handle Errors here.
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // // The email of the user's account used.
          // const email = error.customData.email;
          // // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);

          // console.log(error);
          // console.log(email);
          // console.log(credential);
          // ...
        });
    },

    getGoogleRedirectResult() {
      const auth = getAuth();

      getRedirectResult(auth)
        .then((result) => {
          if (!result) return;

          console.log('result', result);

          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // console.log('credential', credential);
          const token = credential.accessToken;

          // console.log('token', token);

          // The signed-in user info.
          const user = result.user;

          // console.log('user', user)
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          console.log('error getRedirectResult', error);
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

    handleError(errorCode = 'default') {
      console.log('errorCode', errorCode);

      this.loading = false;
      this.errorCode = errorCode;
    },

    signInSuccess(user) {
      this.loading = true;

      // if (additionalUserInfo?.isNewUser) this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      // TODO: if new user, add to keap via clouud function / API
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.$router.replace({ name: 'boards' });
      this.$bus.$emit('BOOT');
    },

    // addContact() {
    //   this.$store.dispatch('ADD_CONTACT_TO_KEAP');
    // },
  },
};
</script>
