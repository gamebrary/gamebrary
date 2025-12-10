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
      <a href="#" @click.prevent="newUser = !newUser" class="link-primary">{{ authAction }}</a>
    </p>

    <div
      class="alert alert-danger"
      role="alert"
      :class="{ 'd-none': !showExpiredAlert && !errorCode }"
    >
      <template v-if="showExpiredAlert">
        Session expired
      </template>

      <template v-else>
        <div>{{ errorMessage }}</div>
      </template>
    </div>

    <form
      @submit.prevent="submit"
      class="bg-dangers"
    >
      <input
        v-model="email"
        id="email"
        type="email"
        class="form-control mb-3"
        required
        autocomplete="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        class="form-control mb-3"
        id="password"
        type="password"
        required
        autocomplete="new-password"
        placeholder="Password"
      />

      <button
        type="submit"
        class="btn w-100"
        :class="darkTheme ? 'btn-success' : 'btn-primary'"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>{{ newUser ? 'Create account' : 'Login' }}</span>
      </button>

      <br />

      <button
        type="button"
        class="btn mt-3 p-0"
        style="background: transparent; border: none;"
        @click="loginWithGoogle"
      >
        <img
          :src="`img/google-sign-${newUser ? 'up' : 'in'}-button-light.svg`"
          alt="Sign in with Google"
        />
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAppGetters } from '@/stores/getters';
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

const app = initializeApp(FIREBASE_CONFIG);
const router = useRouter();
const userStore = useUserStore();
const { darkTheme } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const showExpiredAlert = ref(false);
const loading = ref(false);
const email = ref('');
const password = ref('');
const newUser = ref(true);
const errorCode = ref(null);

// Store state and getters
const user = computed(() => userStore.user);
const sessionExpired = computed(() => userStore.sessionExpired);

// Computed properties
const authDescription = computed(() => {
  return newUser.value
    ? 'Already have an account?'
    : 'Need an account?';
});

const authAction = computed(() => {
  return newUser.value
    ? 'Login'
    : 'Create account';
});

const errorMessage = computed(() => {
  if (!errorCode.value) return null;
  if (errorCode.value === 'auth/email-already-in-use') return 'Email already in use';
  if (errorCode.value === 'auth/wrong-password') return 'Wrong password';
  if (errorCode.value === 'auth/user-not-found') return 'User not found';
  if (newUser.value) return 'Error creating your account';
  return 'Error logging in';
});

// Methods
const submit = () => {
  loading.value = true;

  if (newUser.value) {
    createAccount();
  } else {
    loginWithEmail();
  }
};

const init = () => {
  if (sessionExpired.value) {
    showExpiredAlert.value = true;
    userStore.setSessionExpired(false);
  }
};

const createAccount = async () => {
  const auth = getAuth(app);

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      userStore.setSessionExpired(false);
      userStore.setUser(userCredential?.user);
      router.replace({ name: 'boards' });
    })
    .catch((error) => {
      handleError(error?.code);
    });
};

const loginWithEmail = async () => {
  try {
    const auth = getAuth(app);
    const data = await signInWithEmailAndPassword(auth, email.value, password.value);
    signInSuccess(data.user);
  } catch (error) {
    handleError(error?.code);
  }
};

const loginWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const { user } = await signInWithPopup(auth, provider);
    signInSuccess(user);
  } catch (error) {
    handleError(error?.code);
  }
};

const handleError = (code = 'default') => {
  loading.value = false;
  errorCode.value = code;
};

const signInSuccess = (user) => {
  loading.value = true;
  // if (additionalUserInfo?.isNewUser) store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
  userStore.setSessionExpired(false);
  userStore.setUser(user);
  router.replace({ name: 'boards' });
  $bus.$emit('BOOT');
};

// Lifecycle hooks
onMounted(() => {
  init();
});
</script>
