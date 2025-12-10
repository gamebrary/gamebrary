<template>
  <router-link :to="userName ? { name: 'public.profile', params: { userName } } : { name: 'create.profile' }"
    class="btn btn-lg w-100 text-start d-block" :class="darkTheme ? 'btn-dark' : 'btn-light'">
    <img v-if="avatarImage" :src="avatarImage" :alt="displayUserName" class="rounded-circle me-2"
      style="width: 32px; height: 32px; object-fit: cover;" />

    <i v-else class="fa-regular fa-user fa-fw me-2" />

    {{ userName ? displayUserName : 'Profile' }}
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useProfileStore } from '@/stores/profile';
import { useAppGetters } from '@/stores/getters';
import { loadFirebaseImage } from '@/utils/firebase';
import { getImageThumbnail } from '@/utils';

const boardsStore = useBoardsStore();
const userStore = useUserStore();
const profileStore = useProfileStore();
const { darkTheme } = useAppGetters();

// Reactive state
const avatarImage = ref(null);
const wallpaperImage = ref(null);

// Store state and getters
const board = computed(() => boardsStore.board);
const user = computed(() => userStore.user);
const profile = computed(() => profileStore.profile);

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
    ? `${userName.value}`
    : 'Profile';
});

// Methods
const load = async () => {
  if (user.value?.uid) {
    await profileStore.loadProfile(user.value.uid).catch(() => { });
  }

  if (profile.value?.avatar) loadAvatarImage();

  if (profile.value?.wallpaper) {
    try {
      wallpaperImage.value = await loadFirebaseImage(profile.value?.wallpaper);
    } catch (e) {
      wallpaperImage.value = null;
    }
  }
};

const loadAvatarImage = async () => {
  const thumbnailRef = getImageThumbnail(profile.value?.avatar);
  try {
    avatarImage.value = await loadFirebaseImage(thumbnailRef);
  } catch (e) {
    avatarImage.value = null;
  }
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
