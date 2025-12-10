<template lang="html">
  <div class="container">
    <EditProfileSidebar v-if="isProfileOwner" />

    <div v-if="loading && profile === null" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="profile">
      <portal to="headerActions">
        <button v-if="isProfileOwner" type="button" class="btn btn-primary"
          @click="uiStore.setEditProfileSidebarOpen(true)">
          Edit profile
        </button>
      </portal>

      <div class="text-center">
        <img v-if="avatarImage" :src="avatarImage" class="rounded-circle mx-auto mt-5 mb-3"
          style="width: 200px; height: 200px; object-fit: cover;" :alt="profile.userName" />
        <div v-else class="rounded-circle mx-auto mt-5 mb-3 d-flex align-items-center justify-content-center"
          style="width: 200px; height: 200px; background-color: var(--bs-gray-300);">
          <i class="fa-regular fa-user fa-4x"></i>
        </div>

        <h3 :title="profile.name" data-bs-toggle="tooltip">
          @{{ profile.userName }}
        </h3>

        <q v-if="profile.bio" class="d-block text-subtle mt-2">
          {{ profile.bio }}
        </q>

        <div class="mt-2">
          <a v-if="profile.website" :href="profile.website" target="_blank" :title="profile.website"
            class="btn btn-outline-secondary mx-1" data-bs-toggle="tooltip">
            <i class="fa-regular fa-globe-pointer fa-fw" />
          </a>

          <a v-if="profile.twitter" :href="`https://twitter.com/${profile.twitter}`" target="_blank"
            :title="profile.twitter" class="btn btn-outline-secondary mx-1" data-bs-toggle="tooltip">
            <i class="fa-brands fa-x-twitter fa-fw" />
          </a>

          <a v-if="userLocation" :href="userLocation" :title="profile.location" class="btn btn-outline-secondary mx-1"
            data-bs-toggle="tooltip" target="_blank">
            <i class="fa-solid fa-location-dot fa-fw" />
          </a>
        </div>
      </div>

      <!-- <button :to="{ name: 'profiles' }">
        View other profiles
      </button> -->

      <div class="board-grid mt-5">
        <MiniBoard v-for="board in userBoards" :key="board.id" :board="board" />
      </div>
    </div>

    <EmptyState v-else title="404 Not Found" message="Page not found!" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useProfileStore } from '@/stores/profile';
import { useBoardsStore } from '@/stores/boards';
import { loadFirebaseImage } from '@/utils/firebase';
import { getImageThumbnail } from '@/utils';
import MiniBoard from '@/components/Board/MiniBoard';
import EditProfileSidebar from '@/components/EditProfileSidebar';
import EmptyState from '@/components/EmptyState';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const uiStore = useUIStore();
const profileStore = useProfileStore();
const boardsStore = useBoardsStore();
const $bus = inject('$bus');

const error = ref(false);
const loading = ref(false);
const userBoards = ref([]);
const profile = ref(null);
const avatarImage = ref(null);
const wallpaperImage = ref(null);

const userName = computed(() => route.params.userName);
const user = computed(() => userStore.user);
const editProfileSidebarOpen = computed(() => uiStore.editProfileSidebarOpen);

const userLocation = computed(() => {
  if (!profile.value?.location) return null;
  const location = profile.value?.location?.replace(' ', '+');
  return `https://www.google.com/maps/search/${location}`;
});

const isProfileOwner = computed(() => {
  if (!user.value?.uid) return false;
  return user.value?.uid === profile.value?.uid;
});

const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

const viewPublicBoard = (id) => {
  router.push({ name: 'public.board', params: { id } });
};

const loadProfile = async () => {
  error.value = false;
  loading.value = profile.value === null;

  try {
    profile.value = await profileStore.loadPublicProfileByUsername(userName.value);
  } catch (e) {
    error.value = true;
  }

  if (!profile.value) {
    loading.value = false;
    document.title = 'Page not found - Gamebrary';
    return;
  }

  try {
    userBoards.value = await boardsStore.loadUserPublicBoards(profile.value.uid);
  } catch (e) {
    error.value = true;
  }

  if (profile.value?.avatar) {
    const thumbnailRef = getImageThumbnail(profile.value?.avatar);
    try {
      avatarImage.value = await loadFirebaseImage(thumbnailRef);
    } catch (e) {
      console.error('Error loading avatar:', e);
    }
  } else {
    avatarImage.value = null;
  }

  if (profile.value?.wallpaper) {
    try {
      wallpaperImage.value = await loadFirebaseImage(profile.value?.wallpaper);
    } catch (e) {
      console.error('Error loading wallpaper:', e);
    }
  }

  loading.value = false;
};

watch(userName, (value) => {
  if (value) {
    loadProfile();
  }
});

watch(wallpaperImage, (value) => {
  if (value && $bus) $bus.$emit('UPDATE_WALLPAPER', value);
});

onMounted(() => {
  if ($bus) {
    $bus.$on('LOAD_PROFILE', loadProfile);
  }
  loadProfile();
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('LOAD_PROFILE');
    $bus.$emit('CLEAR_WALLPAPER');
  }
});
</script>
