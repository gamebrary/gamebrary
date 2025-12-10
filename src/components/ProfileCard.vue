<template lang="html">
  <router-link v-if="thumbnail" :to="{ name: 'public.profile', params: { userName: profile.userName } }"
    class="d-inline-block" :title="`@${profile.userName}`" data-bs-toggle="tooltip">
    <img v-if="avatarImage" :src="avatarImage" class="rounded-circle"
      style="width: 80px; height: 80px; object-fit: cover;" :alt="`@${profile.userName}`" />
    <div v-else class="rounded-circle d-flex align-items-center justify-content-center"
      style="width: 80px; height: 80px; background-color: var(--bs-gray-300);">
      <i class="fa-regular fa-user fa-2x"></i>
    </div>
  </router-link>

  <div v-else class="card">
    <div class="profile-card">
      <router-link :to="{ name: 'public.profile', params: { userName: profile.userName } }" class="d-inline-block"
        :title="`@${profile.userName}`" data-bs-toggle="tooltip">
        <img v-if="avatarImage" :src="avatarImage" class="rounded-circle"
          style="width: 80px; height: 80px; object-fit: cover;" :alt="`@${profile.userName}`" />
        <div v-else class="rounded-circle d-flex align-items-center justify-content-center"
          style="width: 80px; height: 80px; background-color: var(--bs-gray-300);">
          <i class="fa-regular fa-user fa-2x"></i>
        </div>
      </router-link>

      <aside v-if="!thumbnail" class="d-flex flex-column">
        <router-link :to="{ name: 'public.profile', params: { userName: profile.userName } }">
          <strong>@{{ profile.userName }}</strong>
        </router-link>
        <q v-if="profile.bio">{{ profile.bio }}</q>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick } from 'vue';
import { getStorage, ref as firebaseStorageRef, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';
import { getImageThumbnail } from '@/utils';

const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage(app);

const props = defineProps({
  thumbnail: Boolean,
  profile: {
    type: Object,
    required: true,
  },
});

// Reactive state
const avatarImage = ref(null);

// Methods
const loadFirebaseImage = async (path) => {
  return await getDownloadURL(firebaseStorageRef(storage, path));
};

const initTooltips = () => {
  nextTick(() => {
    const el = document.querySelector('[data-bs-toggle="tooltip"]');
    if (el) {
      const tooltipTriggerList = el.parentElement?.querySelectorAll('[data-bs-toggle="tooltip"]') || [];
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        if (!tooltipTriggerEl._tooltip) {
          new bootstrap.Tooltip(tooltipTriggerEl);
        }
      });
    }
  });
};

// Lifecycle hooks
onMounted(async () => {
  if (props.profile?.avatar) {
    const thumbnailRef = getImageThumbnail(props.profile?.avatar);
    avatarImage.value = await loadFirebaseImage(thumbnailRef)
      .catch((e) => null);
  }
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});
</script>


<style lang="scss" scoped>
.profile-card {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 80px auto;
}
</style>
