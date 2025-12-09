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
            :placeholder="$t('tags.form.inputPlaceholder')"
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

<script>
import GameCard from '@/components/GameCard';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      tag: {},
      saving: false,
      prevRoute: null,
    }
  },

  components: {
    AppSidebar,
    GameCard,
    SidebarHeader,
  },

  computed: {
    ...mapState(['tags', 'cachedGames', 'activeTagIndex']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    isEmpty() {
      return this.tag?.games?.length === 0;
    },
  },

  watch: {
    activeTagIndex() {
      this.load();
    },
  },

  async mounted() {
    if (this.$bus) {
      this.$bus.$on('SAVE_TAGS', this.selectGame);
    }
    this.load();
  },

  destroyed() {
    if (this.$bus) {
      this.$bus.$off('SAVE_TAGS', this.selectGame);
    }
  },

  beforeRouteEnter(to, from, next) {
      next(vm => vm.prevRoute = from?.path);
  },

  methods: {
    handleVisibilityChange(visible) {
      if (!visible) {
        this.closeSidebar();
      }
    },

    hideSidebar() {
      this.$store.commit('SET_ACTIVE_TAG_INDEX', null);
    },

    closeSidebar() {
      this.$store.commit('SET_ACTIVE_TAG_INDEX', null);
    },

    async selectGame(gameId) {
      const { activeTagIndex, tags } = this;

      this.$store.commit('APPLY_TAG_TO_GAME', { tagIndex: activeTagIndex, gameId });

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});
      await this.$store.dispatch('LOAD_IGDB_GAMES', [gameId]);

      this.tag = JSON.parse(JSON.stringify(tags[activeTagIndex]));
    },

    openGameSelectorSidebar() {
      this.$store.commit('SET_GAME_SELECTOR_DATA', {
        title: 'Tag game',
        filter: this.tag?.games,
        eventName: 'SAVE_TAGS',
      });
    },

    async load() {
      const { tags, activeTagIndex } = this;

      if (activeTagIndex === null) return;

      this.tag = JSON.parse(JSON.stringify(tags?.[activeTagIndex]));
    },

    async promptDeleteTag() {
      const confirmed = window.confirm(this.$t('tags.delete.message'));
      if (confirmed) this.deleteTag();
    },

    async deleteTag() {
      this.$store.commit('REMOVE_TAG', this.activeTagIndex);

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});

      this.closeSidebar();
    },

    async saveTag() {
      this.saving = true;
      const { tag, activeTagIndex } = this;
      this.$store.commit('UPDATE_TAG', { tagIndex: activeTagIndex, tag });

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {});

      this.saving = false;
      this.closeSidebar();
    },
  },
};
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
