<template>
  <router-link
    :to="userName ? { name: 'public.profile', params: { userName } } : { name: 'create.profile' }"
    class="btn btn-lg w-100 text-start d-block"
    :class="darkTheme ? 'btn-dark' : 'btn-light'"
  >
    <img
      v-if="avatarImage"
      :src="avatarImage"
      :alt="displayUserName"
      class="rounded-circle me-2"
      style="width: 32px; height: 32px; object-fit: cover;"
    />

    <i v-else class="fa-regular fa-user fa-fw me-2" />

    {{ userName ? displayUserName : 'Profile' }}
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getImageThumbnail } from '@/utils';

const store = useStore();

// Reactive state
const avatarImage = ref(null);
const wallpaperImage = ref(null);

// Store state and getters
const board = computed(() => store.state.board);
const user = computed(() => store.state.user);
const profile = computed(() => store.state.profile);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const style = computed(() => {
  return wallpaperImage.value
    ? `background-image: url('${wallpaperImage.value}'); background-size: cover;`
    : null;
});

const userName = computed(() => {
  return profile.value?.userName;
});

const displayUserName = computed(() => {
  return userName.value
    ? `@${userName.value}`
    : 'Profile';
});

// Methods
const load = async () => {
  await store.dispatch('LOAD_PROFILE').catch(() => {});

  if (profile.value?.avatar) loadAvatarImage();

  if (profile.value?.wallpaper) {
    wallpaperImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', profile.value?.wallpaper)
      .catch(() => null);
  }
};

const loadAvatarImage = async () => {
  const thumbnailRef = getImageThumbnail(profile.value?.avatar);
  avatarImage.value = await store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef)
    .catch(() => null);
};

// Lifecycle hooks
onMounted(() => {
  if (user.value) load();
});
</script>

<style scoped>
.profile-card {
  margin-top: -72px;
  padding-top: 80px;
}
</style>
