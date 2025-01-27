<template lang="html">
  <div class="px-3 mx-auto" style="max-width: 420px">
    <div class="text-center mb-3">
      <img
        src="/img/gamebrary-logo.png"
        alt="Gamebrary"
        width="300"
        class="mb-3"
      />

      <h3>Elevate your game, Organize your way</h3>
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
        <div>{{ errorMessage }}</div>
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
      newUser: true,
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
    },

    async createAccount() {
      const auth = getAuth(app);

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          this.$store.commit('SET_SESSION_EXPIRED', false);
          this.$store.commit('SET_USER', userCredential?.user);
          this.$router.replace({ name: 'boards' });
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

    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        const { user } = await signInWithPopup(auth, provider);

        this.signInSuccess(user);
      } catch (error) {
        this.handleError(error?.code);
      }
    },

    handleError(errorCode = 'default') {
      this.loading = false;
      this.errorCode = errorCode;
    },

    signInSuccess(user) {
      this.loading = true;

      // if (additionalUserInfo?.isNewUser) this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
      this.$store.commit('SET_SESSION_EXPIRED', false);
      this.$store.commit('SET_USER', user);
      this.$router.replace({ name: 'boards' });
      this.$bus.$emit('BOOT');
    },
  },
};
</script>
