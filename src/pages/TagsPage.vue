<template lang="html">
  <div class="container">
    <portal v-if="user && !isEmpty" to="headerActions">
      <div class="dropdown">
        <button class="btn dropdown-toggle" :class="darkTheme ? 'btn-success' : 'btn-dark'" type="button"
          id="tagsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          Tags
        </button>
        <ul class="dropdown-menu" aria-labelledby="tagsDropdown">
          <li>
            <button type="button" class="dropdown-item" :class="darkTheme ? 'text-light' : ''"
              data-bs-toggle="offcanvas" data-bs-target="#create-tag-sidebar">
              <PhPlus :size="16" weight="fill" />
              Add tag
            </button>
          </li>
        </ul>
      </div>
    </portal>

    <div v-if="loading" class="spinner-centered d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <EmptyState v-else-if="isEmpty" illustration="tags"
      message="Using tags is a fantastic way to keep your collection well-organized!">
      <button v-if="user" type="button" class="btn btn-primary" data-bs-toggle="offcanvas"
        data-bs-target="#create-tag-sidebar">
        Add tag
      </button>
    </EmptyState>

    <div v-else>
      <ul class="list-group">
        <li v-for="({ textColor, bgColor, name, games: taggedGames }, index) in tags" :key="index"
          class="list-group-item d-flex flex-column align-items-start"
          :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'" @click="openEditTagSidebar(index)"
          style="cursor: pointer;">
          <div class="d-flex w-100 justify-content-md-between flex-column flex-md-row">
            <div class="d-flex flex-column">
              <button type="button" class="btn mb-2" :style="`background-color: ${bgColor}; color: ${textColor}`">
                {{ name }}
              </button>

              <span class="badge bg-primary rounded-pill">
                {{ taggedGames.length }} games
              </span>
            </div>

            <div class="d-flex mt-3 mt-md-0 overflow-hidden">
              <GameCard v-for="gameId in taggedGames" small slim hide-title vertical hide-platforms hide-tags
                hide-progress class="ms-md-n5 border-light border" :key="gameId" :game-id="gameId" />
            </div>
          </div>
        </li>
      </ul>

      <!-- <b-button
        v-for="({ textColor, bgColor, name, games }, index) in tags"
        @click="$router.push({ name: 'tag.edit', params: { id: index } })"
        rounded
        block
        variant="transparent"
        :style="`background-color: ${bgColor}; color: ${textColor}`"
        :key="name"
      >
        {{ name }} {{ games.length ? `(${games.length})` : '' }}
      </b-button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTagsStore } from '@/stores/tags';
import { useUserStore } from '@/stores/user';
import { useGamesStore } from '@/stores/games';
import { useUIStore } from '@/stores/ui';
import { useTwitchStore } from '@/stores/twitch';
import { useAppGetters } from '@/stores/getters';
import GameCard from '@/components/GameCard';
import EmptyState from '@/components/EmptyState';
import { PhPlus } from '@phosphor-icons/vue';

const tagsStore = useTagsStore();
const userStore = useUserStore();
const gamesStore = useGamesStore();
const uiStore = useUIStore();
const twitchStore = useTwitchStore();
const { darkTheme, buttonProps } = useAppGetters();

// Reactive state
const loading = ref(false);

// Store state and getters
const tags = computed(() => tagsStore.tags);
const user = computed(() => userStore.user);
const cachedGames = computed(() => gamesStore.cachedGames);
const activeTagIndex = computed(() => uiStore.activeTagIndex);

// Computed properties
const isEmpty = computed(() => tags.value?.length === 0);

// Methods
const openEditTagSidebar = (index) => {
  uiStore.setActiveTagIndex(index);
};

const load = async () => {
  try {
    loading.value = tags.value.length === 0;

    await tagsStore.loadTags(userStore.user.uid);

    const allGames = Array.from(new Set(tags.value.map(({ games }) => games).flat()));
    const cachedGamesKeys = Object.keys(cachedGames.value);
    const gamesNotCached = allGames?.filter((game) => !cachedGamesKeys.includes(String(game)))?.toString();

    if (gamesNotCached) {
      if (!twitchStore.twitchToken) {
        await twitchStore.getTwitchToken();
      }
      await gamesStore.loadIGDBGames(twitchStore.twitchToken, gamesNotCached);
    }
  } catch (e) {
    //
  }

  loading.value = false;
};

// Watchers
watch(activeTagIndex, (activeIndex) => {
  if (activeIndex === null) load();
});

// Lifecycle hooks
onMounted(() => {
  if (user.value?.uid) load();
});
</script>
