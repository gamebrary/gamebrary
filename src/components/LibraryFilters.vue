<template lang="html">
  <AppSidebar id="libraryFiltersSidebar" :visible="visible" :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant" :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange">
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Filter Library" />
    </template>

    <div class="p-3">
      <a v-if="hasActiveFilters" href="#" class="link-primary small d-block mb-3" @click.prevent="clearAllFilters">
        Clear all filters
      </a>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.platform ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#platforms-accordion" aria-expanded="false"
        aria-controls="platforms-accordion">
        Platform
        <span v-if="activeFilters.platform" class="badge bg-light text-dark ms-2">
          {{ getPlatformName(activeFilters.platform) }}
        </span>
      </button>

      <div class="collapse" id="platforms-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button v-for="{ id, name } in sortedPlatforms" :key="id" type="button" class="btn btn-sm"
            :class="activeFilters.platform === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
            @click="toggleFilter('platform', id)">
            {{ name }}
          </button>
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.genre ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#genres-accordion" aria-expanded="false"
        aria-controls="genres-accordion">
        Genre
        <span v-if="activeFilters.genre" class="badge bg-light text-dark ms-2">
          {{ getGenreName(activeFilters.genre) }}
        </span>
      </button>

      <div class="collapse" id="genres-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button v-for="{ id, name } in GAME_GENRES" :key="id" type="button" class="btn btn-sm"
            :class="activeFilters.genre === id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
            @click="toggleFilter('genre', id)">
            {{ name }}
          </button>
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.status ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#status-accordion" aria-expanded="false"
        aria-controls="status-accordion">
        Status
        <span v-if="activeFilters.status" class="badge bg-light text-dark ms-2">
          {{ getStatusName(activeFilters.status) }}
        </span>
      </button>

      <div class="collapse" id="status-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button v-for="{ value, label } in statusOptions" :key="value" type="button" class="btn btn-sm"
            :class="activeFilters.status === value ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
            @click="toggleFilter('status', value)">
            {{ label }}
          </button>
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.played !== null ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#played-accordion" aria-expanded="false"
        aria-controls="played-accordion">
        Played
        <span v-if="activeFilters.played !== null" class="badge bg-light text-dark ms-2">
          {{ activeFilters.played ? 'Yes' : 'No' }}
        </span>
      </button>

      <div class="collapse" id="played-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button v-for="option in playedOptions" :key="option.value" type="button" class="btn btn-sm"
            :class="activeFilters.played === option.value ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
            @click="toggleFilter('played', option.value)">
            {{ option.label }}
          </button>
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.ratingMin !== null ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#rating-accordion" aria-expanded="false"
        aria-controls="rating-accordion">
        Rating
        <span v-if="activeFilters.ratingMin !== null" class="badge bg-light text-dark ms-2">
          {{ activeFilters.ratingMin }}+
        </span>
      </button>

      <div class="collapse" id="rating-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="mb-3">
          <label class="form-label">Minimum Rating</label>
          <input type="range" class="form-range" min="0" max="100" step="10" :value="activeFilters.ratingMin || 0"
            @input="updateRatingFilter($event.target.value)" />
          <div class="d-flex justify-content-between">
            <small>0</small>
            <small>{{ activeFilters.ratingMin || 0 }}</small>
            <small>100</small>
          </div>
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.releaseYear !== null ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#year-accordion" aria-expanded="false" aria-controls="year-accordion">
        Release Year
        <span v-if="activeFilters.releaseYear !== null" class="badge bg-light text-dark ms-2">
          {{ activeFilters.releaseYear }}
        </span>
      </button>

      <div class="collapse" id="year-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="mb-3">
          <label class="form-label">Year</label>
          <input type="number" class="form-control" :min="minYear" :max="maxYear"
            :value="activeFilters.releaseYear || ''" @input="updateYearFilter($event.target.value)"
            placeholder="e.g. 2020" />
        </div>
      </div>

      <button type="button" class="btn w-100 mb-3"
        :class="activeFilters.tag !== null ? 'btn-primary' : darkTheme ? 'btn-light' : 'btn-outline-primary'"
        data-bs-toggle="collapse" data-bs-target="#tags-accordion" aria-expanded="false" aria-controls="tags-accordion">
        Tags
        <span v-if="activeFilters.tag !== null" class="badge bg-light text-dark ms-2">
          {{ getTagName(activeFilters.tag) }}
        </span>
      </button>

      <div class="collapse" id="tags-accordion" data-bs-parent="#libraryFiltersSidebar">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button v-for="tag in tags" :key="tag.id" type="button" class="btn btn-sm"
            :class="activeFilters.tag === tag.id ? 'btn-primary' : darkTheme ? 'btn-dark' : 'btn-light'"
            :style="activeFilters.tag === tag.id ? `background-color: ${tag.bgColor}; color: ${tag.textColor};` : ''"
            @click="toggleFilter('tag', tag.id)">
            {{ tag.name }}
          </button>
        </div>
      </div>
    </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useTagsStore } from '@/stores/tags';
import { useAppGetters } from '@/stores/getters';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';
import { GAME_GENRES, PLATFORMS } from '@/constants';
import orderby from 'lodash.orderby';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      platform: null,
      genre: null,
      status: null,
      played: null,
      ratingMin: null,
      releaseYear: null,
      tag: null,
    }),
  },
});

const emit = defineEmits(['update:filters']);

const gamesStore = useGamesStore();
const tagsStore = useTagsStore();
const { darkTheme, sidebarRightProps } = useAppGetters();
const $bus = inject('$bus');

// Reactive state
const visible = ref(false);

// Store state and getters
const platforms = computed(() => gamesStore.platforms);
const tags = computed(() => tagsStore.tags || []);

// Computed properties
const sortedPlatforms = computed(() => {
  return orderby(platforms.value, [(platform) => platform.name]);
});

const activeFilters = computed(() => props.filters);

const hasActiveFilters = computed(() => {
  return Object.values(activeFilters.value).some(value => value !== null);
});

const statusOptions = [
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'wishlist', label: 'Wishlist' },
];

const playedOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const minYear = computed(() => {
  // Get earliest release year from games
  const games = gamesStore.cachedGames || {};
  const years = Object.values(games)
    .map(game => {
      if (game?.release_dates?.[0]?.date) {
        return new Date(game.release_dates[0].date * 1000).getFullYear();
      }
      return null;
    })
    .filter(year => year !== null);
  return years.length > 0 ? Math.min(...years) : 1970;
});

const maxYear = computed(() => {
  return new Date().getFullYear();
});

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
};

const toggleFilter = (filterType, value) => {
  const newFilters = { ...activeFilters.value };

  // Toggle: if same value, clear it; otherwise set it
  if (newFilters[filterType] === value) {
    newFilters[filterType] = null;
  } else {
    newFilters[filterType] = value;
  }

  emit('update:filters', newFilters);
};

const updateRatingFilter = (value) => {
  const newFilters = { ...activeFilters.value };
  const numValue = Number(value);
  // Treat 0, empty string, or NaN as null (no filter)
  newFilters.ratingMin = (value && value !== '0' && !isNaN(numValue) && numValue > 0) ? numValue : null;
  emit('update:filters', newFilters);
};

const updateYearFilter = (value) => {
  const newFilters = { ...activeFilters.value };
  const numValue = Number(value);
  // Treat 0, empty string, or NaN as null (no filter)
  newFilters.releaseYear = (value && value !== '0' && !isNaN(numValue) && numValue > 0) ? numValue : null;
  emit('update:filters', newFilters);
};

const clearAllFilters = () => {
  emit('update:filters', {
    platform: null,
    genre: null,
    status: null,
    played: null,
    ratingMin: null,
    releaseYear: null,
    tag: null,
  });
};

const getPlatformName = (id) => {
  return PLATFORMS[id]?.name || id;
};

const getGenreName = (id) => {
  return GAME_GENRES.find(g => g.id === id)?.name || id;
};

const getStatusName = (status) => {
  return statusOptions.find(s => s.value === status)?.label || status;
};

const getTagName = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId);
  return tag?.name || tagId;
};

// Lifecycle hooks
onMounted(() => {
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'libraryFiltersSidebar') {
        visible.value = !visible.value;
      }
    });
  }
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('bv::toggle::collapse');
  }
});
</script>
