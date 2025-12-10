<template lang="html">
  <form
    autocomplete="off"
    @submit.prevent="checkUserNameAvailability"
  >
    <p>Profile</p>

    <div class="input-group mb-3">
      <span class="input-group-text">
        gamebrary.com/
      </span>
      <input
        id="userName"
        autocomplete="off"
        v-model.trim="userName"
        type="text"
        class="form-control"
        :minlength="MIN_PROFILE_LENGTH"
        :maxlength="MAX_PROFILE_LENGTH"
        required
        :class="{ 'is-invalid': available === false, 'is-valid': available === true }"
        @input="formatUserName"
      />
      <button
        type="submit"
        class="btn btn-outline-secondary"
      >
        <span v-if="checkingAvailability" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <i v-else class="fa-solid fa-magnifying-glass" />
      </button>
    </div>

    <template v-if="available">
      <div
        class="alert alert-success mt-3"
        role="alert"
      >
        Great, <strong>{{ userName }}</strong> is available!
      </div>

      <button
        type="button"
        class="btn btn-success w-100 mb-3"
        @click="createProfile"
        :disabled="saving"
      >
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>Create profile</span>
      </button>
    </template>

    <div v-else-if="!checkingAvailability && available === false">
      User name not available
    </div>

    <hr class="my-3" />
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useUserStore } from '@/stores/user';
import { MIN_PROFILE_LENGTH, MAX_PROFILE_LENGTH, DEFAULT_PROFILE } from '@/constants';

const router = useRouter();
const profileStore = useProfileStore();
const userStore = useUserStore();

const userName = ref('');
const checkingAvailability = ref(false);
const available = ref(undefined);
const saving = ref(false);

const profile = computed(() => profileStore.profile);

const createProfile = async () => {
  saving.value = true;

  const payload = {
    ...DEFAULT_PROFILE,
    userName: userName.value,
  };

  await profileStore.saveProfile(userStore.user.uid, payload);
  saving.value = false;
  router.push({ name: 'public.profile', params: { userName: profile.value?.userName } });
};

const checkUserNameAvailability = async () => {
  checkingAvailability.value = true;
  available.value = await profileStore.checkProfileUsernameAvailability(userName.value);
  checkingAvailability.value = false;
};

const formatUserName = () => {
  userName.value = userName.value.replace(/\W/g, '');
  if (available.value) available.value = false;
};
</script>

<style lang="scss" scoped>
</style>
