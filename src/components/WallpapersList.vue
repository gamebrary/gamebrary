<template lang="html">
  <ul class="list-group">
    <li
      v-for="(wallpaper, index) in sortedWallpapers"
      class="list-group-item list-group-item-action"
      :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
      :key="index"
      @click="handleClick(wallpaper)"
      style="cursor: pointer;"
    >
      <div class="d-flex w-100 p-2 align-items-center">
        <img
          :src="wallpaper.url"
          class="rounded"
          style="width: 200px; height: auto; object-fit: cover;"
          :alt="wallpaper.name"
        />

        <p class="ms-3 text-truncate mb-0">
          {{ wallpaper.name }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import sortby from 'lodash.sortby';
import { THUMBNAIL_PREFIX } from '@/constants';

const props = defineProps({
  selectable: Boolean,
  selected: String,
  saving: Boolean,
});

const emit = defineEmits(['select']);

const wallpapersStore = useWallpapersStore();
const uiStore = useUIStore();
const { darkTheme } = useAppGetters();

// Store state and getters
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Computed properties
const sortedWallpapers = computed(() => {
  const filteredWallpapers = wallpapers.value?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));
  return sortby(filteredWallpapers, 'updated').reverse();
});

const isEmpty = computed(() => {
  return sortedWallpapers.value?.length === 0;
});

// Methods
const handleClick = (wallpaper) => {
  if (props.selectable && wallpaper?.fullPath) {
    emit('select', wallpaper.fullPath);
    const modalElement = document.getElementById('boardWallpaper');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  } else {
    openPreview(wallpaper);
  }
};

const openPreview = (wallpaper) => {
  uiStore.setActiveWallpaper(wallpaper);
};
</script>
