<template lang="html">
  <AppSidebar
    id="gameTagsSidebar"
    :visible="visible"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" :title="sidebarTitle" />
    </template>

    <div class="px-3">
      <div v-if="isEmpty">
        <p>No tags available</p>

        <button
          type="button"
          class="btn"
          :class="darkTheme ? 'btn-dark' : 'btn-light'"
          data-bs-toggle="offcanvas"
          data-bs-target="#create-tag-sidebar"
        >
          Create tag
        </button>
      </div>

      <template v-else>
        <div
          v-for="({ name, bgColor, textColor, games }, index) in tags"
          :key="index"
          class="tag mb-3"
        >
          <button
            v-if="name"
            type="button"
            class="btn text-start rounded"
            :style="`background-color: ${bgColor}; color: ${textColor}`"
            @click="openEditTagSidebar(index)"
          >
            <span class="badge bg-light text-dark me-1">{{ games.length }}</span>
            {{ name }}
          </button>

          <button
            v-if="games"
            type="button"
            class="btn"
            :class="games.includes(Number(game.id)) ? 'btn-danger' : 'btn-light'"
            @click="selectTag(index, games)"
          >
            <i
              v-if="games.includes(Number(game.id))"
              class="fa fa-trash"
              aria-hidden="true"
            />
            <i v-else class="fa fa-plus" aria-hidden="true" />
          </button>
        </div>

        <div class="d-flex align-items-center justify-content-between">
          <button
            type="button"
            class="btn"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            data-bs-toggle="offcanvas"
            data-bs-target="#create-tag-sidebar"
          >
            Create new tag
          </button>
        </div>
      </template>
    </div>
  </AppSidebar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useStore } from 'vuex';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/AppSidebar';

const store = useStore();
const $bus = inject('$bus');

// Reactive state
const visible = ref(false);

// Store state and getters
const tags = computed(() => store.state.tags);
const game = computed(() => store.state.game);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const isEmpty = computed(() => tags.value.length === 0 || !game.value);

const sidebarTitle = computed(() => {
  if (!game.value?.name) return 'Apply tags';
  return `Apply tags to ${game.value.name}`;
});

// Methods
const handleVisibilityChange = (newVisible) => {
  visible.value = newVisible;
};

const hideSidebar = () => {
  visible.value = false;
};

const selectTag = async (tagIndex, games) => {
  const selected = games?.includes(Number(game.value?.id));

  const mutation = selected
    ? 'REMOVE_GAME_FROM_TAG'
    : 'APPLY_TAG_TO_GAME';

  const gameId = Number(game.value?.id);

  store.commit(mutation, { tagIndex, gameId });

  await store.dispatch('SAVE_TAGS').catch(() => {});
};

const openEditTagSidebar = (index) => {
  store.commit('SET_ACTIVE_TAG_INDEX', index);
};

// Lifecycle hooks
onMounted(() => {
  // Listen for sidebar toggle events
  if ($bus) {
    $bus.$on('bv::toggle::collapse', (id) => {
      if (id === 'gameTagsSidebar') {
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

<style lang="scss" rel="stylesheet/scss" scoped>
.tag {
  display: grid;
  grid-template-columns: auto 42px;
  grid-gap: .5rem;
}
</style>