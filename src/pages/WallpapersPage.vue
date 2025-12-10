<template lang="html">
  <div class="px-3">
    <portal v-if="!isEmpty && user" to="headerActions">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          :class="darkTheme ? 'btn-success' : 'btn-dark'"
          type="button"
          id="wallpapersDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Wallpapers
        </button>
        <ul class="dropdown-menu" aria-labelledby="wallpapersDropdown">
          <li>
            <UploadWallpaperButton />
          </li>
        </ul>
      </div>
    </portal>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <EmptyState
      v-else-if="isEmpty"
      message="Add a personal touch to your boards by uploading a wallpaper!"
      illustration="wallpapers"
    >
      <UploadWallpaperButton v-if="user">
        <span class="ms-2">Upload wallpaper</span>
      </UploadWallpaperButton>
    </EmptyState>

    <WallpapersList v-else />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters } from '@/stores/getters';
import { THUMBNAIL_PREFIX } from '@/constants';
import EmptyState from '@/components/EmptyState';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import WallpapersList from '@/components/WallpapersList';

const userStore = useUserStore();
const wallpapersStore = useWallpapersStore();
const { darkTheme } = useAppGetters();

const loading = ref(false);

const user = computed(() => userStore.user);
const wallpapers = computed(() => wallpapersStore.wallpapers);

const isEmpty = computed(() => {
  const filteredWallpapers = wallpapers.value?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));
  return !filteredWallpapers || filteredWallpapers?.length === 0;
});

const loadWallpapers = async () => {
  try {
    loading.value = Boolean(isEmpty.value);
    await wallpapersStore.loadWallpapers(userStore.user.uid);
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

onMounted(() => {
  loadWallpapers();
});
</script>
