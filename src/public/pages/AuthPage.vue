<template lang="html">
  <section>
    <b-container class="field centered text-center">
      <h3 class="mt-5">Welcome to Gamebrary</h3>

      <b-alert
        class="mx-auto text-center"
        :show="!showExpiredAlert"
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

        <b-button @click="login">
          <b-spinner v-if="loading" small />
          <template v-else>Login</template>
        </b-button>
      </div>

      <section v-show="!loading" id="auth" class="py-2" />
    </b-container>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
      if (this.sessionExpired) {
        this.showExpiredAlert = true;
        this.$store.commit('SET_SESSION_EXPIRED', false);
      }

      // if (this.user?.uid) {
      //   console.log('dis');
      //   // this.$router.replace({ name: 'home' });
      // } else {
      //   console.log('start ui');
      // }
    },

    createAccount() {
      this.loading = true;
      const auth = getAuth(app);

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log('userCredential', userCredential);
          // console.log(userCredential);
          // Signed up
          const user = userCredential.user;

          debugger;

          this.$store.commit('SET_SESSION_EXPIRED', false);
          this.$store.commit('SET_USER', user);
          this.$router.push({ name: 'home' });
          // ...
          // TODO: redirect to home
        })
        .catch((error) => {
          this.handleError(error.code)
          this.loading = false;
        });
    },

    login() {
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
