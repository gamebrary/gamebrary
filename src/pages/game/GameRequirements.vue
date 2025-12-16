<template>
  <div class="tab-pane fade show active">
    <section v-if="hasRequirements">
      <h2 class="mb-2">Requirements</h2>

      <ul class="list-group">
        <li class="list-group-item" :class="darkTheme ? 'bg-dark text-light' : 'bg-white'">
          <ul class="nav nav-tabs mt-3" role="tablist">
            <li v-for="(requirement, index) in gameRequirements" :key="index" class="nav-item" role="presentation">
              <button class="nav-link" :class="{ 'active': index === 0 }" :id="`tab-${index}`" data-bs-toggle="tab"
                :data-bs-target="`#tab-pane-${index}`" type="button" role="tab">
                {{ getTabTitle(requirement.platform) }}
              </button>
            </li>
          </ul>
          <div class="tab-content mt-3">
            <div v-for="(requirement, index) in gameRequirements" :key="index" class="tab-pane fade"
              :class="{ 'show active': index === 0 }" :id="`tab-pane-${index}`" role="tabpanel">
              <div class="d-flex flex-column">
                <p v-if="requirement.minimum.length > 100" v-html="requirement.minimum" />
                <p v-if="requirement.recommended.length > 100" v-html="requirement.recommended" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <EmptyState v-else title="No requirements available" message="System requirements are not available for this game." />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useAppGetters } from '@/stores/getters';
import EmptyState from '@/components/EmptyState';

const gamesStore = useGamesStore();
const { darkTheme } = useAppGetters();

const game = computed(() => gamesStore.game);

const macRequirements = computed(() => {
  return game.value?.steam?.mac_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.mac_requirements, platform: 'mac' }
    : null;
});

const linuxRequirements = computed(() => {
  return game.value?.steam?.linux_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.linux_requirements, platform: 'linux' }
    : null;
});

const pcRequirements = computed(() => {
  return game.value?.steam?.pc_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.pc_requirements, platform: 'windows' }
    : null;
});

const gameRequirements = computed(() => {
  return [
    macRequirements.value,
    linuxRequirements.value,
    pcRequirements.value,
  ].filter((req) => req);
});

const hasRequirements = computed(() => {
  return [
    macRequirements.value,
    linuxRequirements.value,
    pcRequirements.value,
  ].some((req) => req);
});

const getTabTitle = (title) => {
  if (title === 'windows') return 'PC/Windows';
  if (title === 'mac') return 'MacOS';
  if (title === 'linux') return 'Linux';
  return title;
};
</script>




