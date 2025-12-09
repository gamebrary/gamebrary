<template lang="html">
  <div
    :class="['list pr-3', { dragging, 'unique': singleList, 'pr-3': isLastList && isPublicBoard }]"
    :id="listIndex"
  >
    <div
      class="card"
      :class="[darkTheme ? 'bg-black text-light' : 'bg-light text-dark', transparencyEnabled ? 'semi-transparent' : '']"
    >
      <div v-if="isBoardOwner" class="p-2">
        <div class="dropdown">
          <button
            class="btn dropdown-toggle"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            type="button"
            :id="`listDropdown-${listIndex}`"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="border: none;"
          >
            <h4 class="d-flex align-items-center m-0">
              <i
                v-if="sortingEnabled"
                class="fa-regular fa-sort fa-fw me-1"
                :class="darkTheme ? 'text-success' : 'text-primary'"
                :title="sortMessage"
                data-bs-toggle="tooltip"
              />

              {{ truncatedListName || 'Untitled list' }}
              <template v-if="list.showGameCount">
                ({{ gameCount }})
              </template>
            </h4>
          </button>
          <ul class="dropdown-menu" :aria-labelledby="`listDropdown-${listIndex}`">
            <li>
              <button
                type="button"
                class="dropdown-item"
                :class="darkTheme ? 'text-light' : ''"
                @click="editList"
              >
                <i class="fa-solid fa-pen fa-fw" />
                Edit list
              </button>
            </li>

            <template v-if="isBoardOwner && (listIndex > 0 || showMoveListRightButton)">
              <li v-if="listIndex > 0">
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="$bus.$emit('MOVE_LIST_LEFT', listIndex)"
                >
                  <i class="fa-regular fa-caret-left fa-fw" />
                  Move left
                </button>
              </li>

              <li v-if="showMoveListRightButton">
                <button
                  type="button"
                  class="dropdown-item"
                  :class="darkTheme ? 'text-light' : ''"
                  @click="$bus.$emit('MOVE_LIST_RIGHT', listIndex)"
                >
                  <i class="fa-regular fa-caret-right fa-fw" />
                  Move right
                </button>
              </li>
            </template>

            <li v-if="isBoardOwner">
              <button
                type="button"
                class="dropdown-item"
                :class="darkTheme ? 'text-light' : ''"
                @click="openGameSelectorSidebar"
              >
                <i class="fa-solid fa-plus fa-fw" />
                Add games
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button
        v-else
        type="button"
        class="btn btn-sm disabled text-start"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
      >
        <strong>{{ list.name }}</strong>
      </button>

      <draggable
        class="games px-2 pt-1"
        v-bind="draggableProps"
        :list="list.games"
        :id="listIndex"
        :item-key="(gameId) => gameId"
        :move="validateMove"
        :disabled="draggingDisabled"
        @end="dragEnd"
        @start="dragStart"
      >
        <template #item="{ element: gameId }">
        <GameCard
          :ref="(el) => { if (el) gameRefs[`${listIndex}-${gameId}`] = [el] }"
          :game-id="gameId"
          :key="gameId"
          :list-index="listIndex"
          :list="list"
          class="mb-2"
          :vertical="list.vertical"
          :small="list.smallCover"
          :hide-cover="list.hideCover"
          :hide-title="list.hideTitle"
          @click.native="openGame(gameId, list)"
        />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import draggable from 'vuedraggable';
import GameCard from '@/components/GameCard';
import slugify from 'slugify';
import orderby from 'lodash.orderby';
import {
  SORT_TYPE_ALPHABETICALLY,
  SORT_TYPE_RATING,
  SORT_TYPE_PROGRESS,
  HIGHLIGHTED_GAME_TIMEOUT
} from '@/constants';

const props = defineProps({
  list: {
    type: Object,
    default: () => ({}),
  },
  listIndex: Number,
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const $bus = inject('$bus');

// Reactive state
const draggingId = ref(null);
const editing = ref(false);
const localList = ref({});
const gameRefs = ref({});

// Store state and getters
const cachedGames = computed(() => store.state.cachedGames);
const dragging = computed(() => store.state.dragging);
const progresses = computed(() => store.state.progresses);
const board = computed(() => store.state.board);
const user = computed(() => store.state.user);
const settings = computed(() => store.state.settings);
const isBoardOwner = computed(() => store.getters.isBoardOwner);
const darkTheme = computed(() => store.getters.darkTheme);
const transparencyEnabled = computed(() => store.getters.transparencyEnabled);
const draggableProps = computed(() => store.getters.draggableProps);
const buttonProps = computed(() => store.getters.buttonProps);

// Computed properties
const sortMessage = computed(() => {
  if (sortBy.value === SORT_TYPE_ALPHABETICALLY) return 'List sorted alphabetically';
  if (sortBy.value === SORT_TYPE_RATING) return 'List sorted by rating';
  if (sortBy.value === SORT_TYPE_PROGRESS) return 'List sorted by progress';
  return null;
});

const draggingDisabled = computed(() => !user.value || !isBoardOwner.value);

const isLastList = computed(() => board.value?.lists?.length - 1 === props.listIndex);

const isPublicBoard = computed(() => board.value?.isPublic);

const sortBy = computed(() => props.list?.sortBy);

const sortingEnabled = computed(() => [SORT_TYPE_PROGRESS, SORT_TYPE_RATING, SORT_TYPE_ALPHABETICALLY].includes(sortBy.value));

const sortedGames = computed(() => {
  switch (props.list?.sortBy) {
    case SORT_TYPE_PROGRESS:
      return orderby(props.list?.games, [game => progresses.value?.[game] || 0], ['desc']);
    case SORT_TYPE_RATING:
      return orderby(props.list?.games, [game => cachedGames.value?.[game]?.rating || 0], ['desc']);
    case SORT_TYPE_ALPHABETICALLY:
      return orderby(props.list?.games, [game => cachedGames.value?.[game]?.name]);
    default:
      return props.list?.games || [];
  }
});

const showMoveListRightButton = computed(() => {
  const listsCount = board.value?.lists?.length || 0;
  return props.listIndex < listsCount - 1;
});

const isEmpty = computed(() => props.list?.games?.length === 0);

const singleList = computed(() => board.value.lists.length === 1);

const showGameCount = computed(() => props.list?.showGameCount);

const gameCount = computed(() => props.list?.games?.length || 0);

const gameSelectorEventName = computed(() => `SELECT_GAME_LIST_${props.listIndex}`);

const truncatedListName = computed(() => {
  return props.list.name?.length > 28 ? `${props.list.name.substring(0, 28)}...` : props.list.name;
});

// Methods
const editList = () => {
  store.commit('SET_ACTIVE_BOARD_LIST_INDEX', props.listIndex);
};

const openGameSelectorSidebar = () => {
  store.commit('SET_GAME_SELECTOR_DATA', {
    title: `Add games to ${props.list.name}`,
    filter: props.list.games,
    eventName: gameSelectorEventName.value,
  });
};

const selectGame = (gameId) => {
  return props.list.games.includes(gameId)
    ? removeGame(gameId)
    : addGame(gameId);
};

const addGame = async (gameId) => {
  await store.dispatch('LOAD_IGDB_GAMES', [gameId]);
  const boardCopy = JSON.parse(JSON.stringify(board.value));

  boardCopy?.lists?.[props.listIndex]?.games.push(gameId);

  try {
    await store.dispatch('SAVE_GAME_BOARD', boardCopy);
  } catch (e) {
    // Error handling
  }

  highlightGame(gameId);
};

const highlightGame = (gameId) => {
  store.commit('SET_HIGHLIGHTED_GAME', gameId);

  const gameRef = gameRefs.value[`${props.listIndex}-${gameId}`]?.[0];

  if (gameRef) {
    gameRef?.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      store.commit('SET_HIGHLIGHTED_GAME', null);
    }, HIGHLIGHTED_GAME_TIMEOUT);
  }
};

const removeGame = async () => {
  const { boardId, listIndex } = route?.query;
  const boards = store.state.boards || [];
  const boardIndex = boards.findIndex(({ id }) => id === boardId);
  const boardToUpdate = boards[boardIndex];
  const gameId = route.params?.id;
  const gameIndex = boardToUpdate?.lists?.[listIndex]?.games?.indexOf(gameId);

  boardToUpdate.lists[listIndex].games.splice(gameIndex, 1);

  try {
    await store.dispatch('SAVE_GAME_BOARD', boardToUpdate);
    await store.dispatch('LOAD_BOARD', boardToUpdate.id);
  } catch (e) {
    // Error handling
  }
};

const openGame = (id, list) => {
  const slug = slugify(cachedGames.value[id].slug, { lower: true });

  router.push({
    name: 'game',
    params: {
      id,
      slug,
      boardId: board.value.id,
    },
  });
};

const validateMove = ({ from, to }) => {
  const sameList = from.id === to.id;
  const notInList = !board.value?.lists?.[to.id]?.games?.includes(Number(draggingId.value));
  return sameList || (notInList && !sameList);
};

const dragStart = ({ item }) => {
  store.commit('SET_DRAGGING_STATUS', true);
  draggingId.value = item.id;
};

const dragEnd = () => {
  store.commit('SET_DRAGGING_STATUS', false);
  saveBoard();
};

const saveBoard = async () => {
  await store.dispatch('SAVE_BOARD')
    .catch(() => {
      store.commit('SET_SESSION_EXPIRED', true);
    });
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
onMounted(() => {
  localList.value = JSON.parse(JSON.stringify(props.list));
  $bus.$on(gameSelectorEventName.value, selectGame);
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});

onBeforeUnmount(() => {
  $bus.$off(gameSelectorEventName.value, selectGame);
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  flex-shrink: 0;
  cursor: default;
  width: calc(380px + 1rem);

  @media(max-width: 400px) {
    width: calc(100vw - calc(68px + .5rem));
  }

  &.unique {
    @media(max-width: 400px) {
      width: calc(100vw - calc(58px + .5rem));
    }
  }

  .games {
    overflow: hidden;
    max-height: calc(100dvh - 162px);
    overflow-y: auto;
    width: 100%;
  }
}
</style>
