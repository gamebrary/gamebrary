<template lang="html">
  <div v-if="game" class="game-card position-relative rounded cursor-pointer" :class="[
    {
      vertical,
      small,
      slim,
      highlighted: highlightedGame === gameId,
      'semi-transparent': transparencyEnabled,
    },
    darkTheme ? 'dark text-light' : 'light',
  ]" @click="handleClick">
    <div v-if="!hideCover || hideTitle">
      <div class="position-relative">
        <button v-if="user" type="button" class="btn btn-sm like-button m-1"
          :class="{ 'liked': isLiked, 'bg-transparent': true, 'border-0': true }"
          @click.stop.prevent="$bus.$emit('LIKE_UNLIKE_GAME', game.id)">
          <i :class="[isLiked ? 'fa-solid' : 'fa-regular', 'fa-heart text-danger']" class="fa-fw" />
        </button>

        <img :src="getImageUrl(game, IMAGE_SIZE_COVER_SMALL)" :alt="game.name" class="rounded"
          :class="vertical && fluid ? '' : 'mw-100'" :width="small ? '96' : undefined" style="background-color: #ccc;"
          onerror="this.style.backgroundColor='#ccc';" />

        <GameRibbon v-if="!hideRibbon" :game="game" />
      </div>
    </div>

    <aside>
      <div v-if="showGameProgress" class="progress game-progress" style="height: 8px;" data-bs-toggle="tooltip"
        :title="`${gameProgress}% Completed`">
        <div class="progress-bar" :class="gameProgress == 100 ? 'bg-success' : 'bg-primary'" role="progressbar"
          :style="`width: ${gameProgress}%`" :aria-valuenow="gameProgress" aria-valuemin="0" aria-valuemax="100"></div>
      </div>

      <span v-if="!hideProgress && gameProgress > 0" class="badge rounded-pill bg-success me-1">
        <i v-if="gameProgress == 100" class="fas fa-check fa-fw" aria-hidden />
        <small v-else>{{ gameProgress }}%</small>
      </span>


      <h4 v-if="!hideTitle || hideCover" :class="['text-wrap',
        {
          'text-success': gameCompleted, 'mb-1': board.type !== BOARD_TYPE_GRID,
          'mt-2': vertical,
        }
      ]">
        <span v-if="ranked" class="badge d-inline-block" :class="darkTheme ? 'bg-warning' : 'bg-success'">
          {{ rank }}
        </span>

        {{ game.name }}
      </h4>

      <template v-if="!hideTags && tagsApplied.length">
        <span v-for="({ bgColor, textColor, name }) in tagsApplied" :key="name"
          class="badge rounded-pill me-2 mb-1 p-0 px-2" :style="`background-color: ${bgColor}; color: ${textColor}`">
          <small>{{ name }}</small>
        </span>
      </template>

      <template v-if="!hideNotes && gameNotes">
        <i class="fas fa-book note-indicator text-warning" data-bs-toggle="tooltip" title="See game notes"
          @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })" />
      </template>

      <div v-if="!hidePlatforms && gamePlatformsText" class="d-flex mb-2">
        <small>{{ gamePlatformsText }}</small>
      </div>
    </aside>
  </div>

  <div v-else>
    <img :alt="String(gameId)" src="/placeholder.gif" class="rounded mw-100" style="background-color: #ccc;"
      onerror="this.style.backgroundColor='#ccc';" />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useGamesStore } from '@/stores/games';
import { useTagsStore } from '@/stores/tags';
import { useNotesStore } from '@/stores/notes';
import { useProgressesStore } from '@/stores/progresses';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, PLATFORMS, BOARD_TYPE_GRID } from '@/constants';
import GameRibbon from '@/components/GameRibbon';
import slugify from 'slugify';

const props = defineProps({
  gameId: {
    type: [String, Number],
    required: true,
  },
  vertical: Boolean,
  small: Boolean,
  hideCover: Boolean,
  hideTitle: Boolean,
  hideTags: Boolean,
  hideRibbon: Boolean,
  hideNotes: Boolean,
  slim: Boolean,
  hidePlatforms: Boolean,
  hideProgress: Boolean,
  selectable: Boolean,
  ranked: Boolean,
  rank: Number,
  fluid: Boolean,
  listIndex: Number,
  list: Object,
});

const emit = defineEmits(['click']);

const router = useRouter();
const $bus = inject('$bus');

// Pinia stores
const settingsStore = useSettingsStore();
const gamesStore = useGamesStore();
const tagsStore = useTagsStore();
const notesStore = useNotesStore();
const progressesStore = useProgressesStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const { darkTheme, isRTL, transparencyEnabled } = useAppGetters();

// Store state and getters
const settings = computed(() => settingsStore.settings);
const cachedGames = computed(() => gamesStore.cachedGames);
const tags = computed(() => tagsStore.tags);
const notes = computed(() => notesStore.notes);
const progresses = computed(() => progressesStore.progresses);
const board = computed(() => boardsStore.activeBoard);
const games = computed(() => gamesStore.games);
const user = computed(() => userStore.user);
const highlightedGame = computed(() => uiStore.highlightedGame);

// Computed properties
const game = computed(() => cachedGames.value?.[props.gameId]);

const gamePlatforms = computed(() => {
  return game.value?.platforms?.map((id) => PLATFORMS?.[id]);
});

const gamePlatformsText = computed(() => {
  return game.value?.platforms?.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
});

const gameProgress = computed(() => {
  return props.gameId && progresses.value?.[props.gameId]
    ? progresses.value[props.gameId]
    : 0;
});

const gameCompleted = computed(() => {
  return Number(gameProgress.value) === 100;
});

const showGameProgress = computed(() => {
  return !props.hideProgress && gameProgress.value > 0 && !gameCompleted.value;
});

const isLiked = computed(() => {
  return games.value?.[game.value?.id];
});

const tagsApplied = computed(() => {
  const tagsList = tags.value?.tags || tags.value;
  return tagsList?.filter((tag) => tag?.games?.includes(game.value?.id)) || [];
});

const gameNotes = computed(() => {
  return notes.value?.[props.gameId];
});

// Methods
const handleClick = () => {
  if (props.selectable) {
    emit('click');
    return;
  }

  const id = props.gameId || game.value?.id;
  const slug = slugify(game.value?.slug || '', { lower: true });

  if (!id) {
    console.warn('GameCard: Cannot navigate - game id is missing');
    return;
  }

  router.push({ name: 'game', params: { id, slug } });
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-card {
  display: grid;
  grid-template-columns: 140px auto;
  grid-gap: 1rem;
  transition: background-color 300ms linear, transform 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease;
  padding: 0.5rem;

  &.dragging {
    transform: rotate(3deg) scale(1.05) !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
    z-index: 1000 !important;
    opacity: 0.95 !important;
    cursor: grabbing !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease !important;
  }

  &.ghost {
    .like-button {
      display: none;
    }

    aside {
      opacity: 0.5;
    }

    img {
      opacity: 0.2;
      filter: grayscale(90%);
    }
  }

  &.slim {
    padding: 0;
    grid-gap: 0;
  }

  &.highlighted {
    background-color: var(--success) !important;
    color: var(--dark) !important;

    &.slim::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 4px solid var(--success);
      z-index: 2;
      pointer-events: none;
    }
  }

  &.light {
    background-color: var(--white);

    &:hover {
      background-color: var(--white);
    }
  }

  &.dark {
    background-color: var(--dark);

    &:hover {
      background-color: var(--dark);
    }
  }


  &.small {
    grid-template-columns: 60px auto;
  }

  &.vertical {
    grid-template-columns: auto !important;
    text-align: center;
    justify-content: center;
  }
}

.like-button {
  position: absolute;
  color: var(--danger);
}
</style>

<style lang="scss" rel="stylesheet/scss">
// Non-scoped styles for dragging to work with vuedraggable clones
.game-card.dragging,
.dragging.game-card,
.sortable-drag.game-card {
  transform: rotate(3deg) scale(1.05) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
  z-index: 1000 !important;
  opacity: 0.95 !important;
  cursor: grabbing !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease !important;
  pointer-events: none;
}
</style>
