<template lang="html">
  <AppSidebar
    id="edit-tag-sidebar"
    :visible="activeTagIndex !== null"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="load"
    @hidden="closeSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit tag" />
    </template>

      <form @submit.prevent="saveTag" class="px-3">
        <div class="d-flex">
          <input
            id="tagName"
            type="text"
            v-model.trim="tag.name"
            class="form-control me-2"
            maxlength="20"
            :placeholder="t('tags.form.inputPlaceholder')"
            required
          />

          <input
            type="color"
            v-model="tag.bgColor"
            class="form-control form-control-color me-2"
            style="width: 40px; height: 40px; cursor: pointer;"
            title="Tag background color"
          />

          <input
            type="color"
            v-model="tag.textColor"
            class="form-control form-control-color"
            style="width: 40px; height: 40px; cursor: pointer;"
            title="Tag text color"
          />
        </div>

        <div class="my-3">
          <button
            type="submit"
            class="btn"
            :class="darkTheme ? 'btn-secondary' : 'btn-primary'"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-else>Save</span>
          </button>

          <button
            type="button"
            class="btn btn-danger ms-2"
            @click="promptDeleteTag"
          >
            <i class="fas fa-trash-alt fa-fw" aria-hidden />
          </button>
        </div>

        <div class="border rounded p-3 mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Games tagged</h3>

            <button
              type="button"
              class="btn btn-primary"
              @click="openGameSelectorSidebar"
            >
              <i class="fa-solid fa-plus" />
            </button>
          </div>

          <p v-if="isEmpty">
            No games tagged yet.

            <a
              href="#"
              class="link-primary"
              @click.prevent="openGameSelectorSidebar"
            >
              Tag game
            </a>
          </p>

          <GameCard
            v-for="gameId in tag.games"
            small
            class="mt-3"
            hide-platforms
            hide-progress
            :key="gameId"
            :game-id="gameId"
          />
        </div>
      </form>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import GameCard from '@/components/GameCard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const store = useStore();
const { t } = useI18n();
const $bus = inject('$bus');

// Reactive state
const tag = ref({});
const saving = ref(false);

// Store state and getters
const tags = computed(() => store.state.tags);
const cachedGames = computed(() => store.state.cachedGames);
const activeTagIndex = computed(() => store.state.activeTagIndex);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const isEmpty = computed(() => tag.value?.games?.length === 0);

// Watchers
watch(activeTagIndex, () => {
  load();
});

// Methods
const handleVisibilityChange = (visible) => {
  if (!visible) {
    closeSidebar();
  }
};

const hideSidebar = () => {
  store.commit('SET_ACTIVE_TAG_INDEX', null);
};

const closeSidebar = () => {
  store.commit('SET_ACTIVE_TAG_INDEX', null);
};

const selectGame = async (gameId) => {
  if (activeTagIndex.value === null) return;

  store.commit('APPLY_TAG_TO_GAME', { tagIndex: activeTagIndex.value, gameId });

  await store.dispatch('SAVE_TAGS').catch(() => {});
  await store.dispatch('LOAD_IGDB_GAMES', [gameId]);

  tag.value = JSON.parse(JSON.stringify(tags.value[activeTagIndex.value]));
};

const openGameSelectorSidebar = () => {
  store.commit('SET_GAME_SELECTOR_DATA', {
    title: 'Tag game',
    filter: tag.value?.games,
    eventName: 'SAVE_TAGS',
  });
};

const load = async () => {
  if (activeTagIndex.value === null) return;

  tag.value = JSON.parse(JSON.stringify(tags.value?.[activeTagIndex.value] || {}));
};

const promptDeleteTag = async () => {
  const confirmed = window.confirm(t('tags.delete.message'));
  if (confirmed) {
    await deleteTag();
  }
};

const deleteTag = async () => {
  if (activeTagIndex.value === null) return;

  store.commit('REMOVE_TAG', activeTagIndex.value);

  await store.dispatch('SAVE_TAGS').catch(() => {});

  closeSidebar();
};

const saveTag = async () => {
  if (activeTagIndex.value === null) return;

  saving.value = true;
  try {
    store.commit('UPDATE_TAG', { tagIndex: activeTagIndex.value, tag: tag.value });
    await store.dispatch('SAVE_TAGS');
    closeSidebar();
  } catch (e) {
    // Error handling
  } finally {
    saving.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  if ($bus) {
    $bus.$on('SAVE_TAGS', selectGame);
  }
  load();
});

onBeforeUnmount(() => {
  if ($bus) {
    $bus.$off('SAVE_TAGS', selectGame);
  }
});
</script>

<style>
.color-input {
  height: 38px;
  width: 38px;
  border: 1px solid #ced4da;
  padding: 0;
  background: transparent;
}
</style>
