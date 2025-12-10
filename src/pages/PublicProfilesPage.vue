<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Profiles</h3>
    </portal>

    <div class="container">
      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="profiles-grid">
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.userName"
          :profile="profile"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import ProfileCard from '@/components/ProfileCard';

const profileStore = useProfileStore();
const loading = ref(false);

const profiles = computed(() => profileStore.profiles);

const loadProfiles = async () => {
  try {
    loading.value = true;
    await profileStore.loadProfiles();
  } catch (e) {
    // Error handling
  }
  loading.value = false;
};

onMounted(() => {
  loadProfiles();
});
</script>

<style lang="scss" scoped>

.profiles-grid {
  width: 100%;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: $bp-xl) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: $bp-lg) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
