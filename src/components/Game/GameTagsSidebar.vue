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

<script>
import { mapState, mapGetters } from 'vuex';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';

export default {
  components: {
    AppSidebar,
    SidebarHeader,
  },

  data() {
    return {
      visible: false,
    };
  },

  computed: {
    ...mapState(['tags', 'game']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    isEmpty() {
      return this.tags.length === 0 || !this.game;
    },

    sidebarTitle() {
      if (!this.game?.name) return 'Apply tags';

      return `Apply tags to ${this.game.name}`;
    },
  },

  mounted() {
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'gameTagsSidebar') {
          this.visible = !this.visible;
        }
      });
    }
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('bv::toggle::collapse');
    }
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    hideSidebar() {
      this.visible = false;
    },

    async selectTag(tagIndex, games) {
      const selected = games?.includes(Number(this.game?.id));

      const mutation = selected
        ? 'REMOVE_GAME_FROM_TAG'
        : 'APPLY_TAG_TO_GAME';

      const gameId = Number(this.game?.id);

      this.$store.commit(mutation, { tagIndex, gameId });

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});
    },

    openEditTagSidebar(index) {
      this.$store.commit('SET_ACTIVE_TAG_INDEX', index);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag {
  display: grid;
  grid-template-columns: auto 42px;
  grid-gap: .5rem;
}
</style>