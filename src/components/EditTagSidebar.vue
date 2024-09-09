<template lang="html">
  <b-sidebar
    :visible="activeTagIndex !== null"
    v-bind="sidebarProps"
    right
    @shown="load"
    @hidden="closeSidebar"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide" title="Edit tag" />

      <form @submit.prevent="saveTag" class="p-3">
        <div class="d-flex">
          <b-form-input
            id="tagName"
            v-model.trim="tag.name"
            class="mr-2"
            maxlength="20"
            :placeholder="$t('tags.form.inputPlaceholder')"
            required
            trim
          />

          <v-swatches
            v-model="tag.bgColor"
            v-b-tooltip.hover
            v-bind="swatchesProps"
            class="mr-2"
            title="Tag background color"
          />

          <v-swatches
            v-model="tag.textColor"
            v-b-tooltip.hover
            v-bind="swatchesProps"
            title="Tag text color"
          />
        </div>

        <div class="my-3">
          <b-button
            :variant="darkTheme ? 'secondary' : 'primary'"
            :disabled="saving"
            type="submit"
          >
            <b-spinner small v-if="saving" />
            <span v-else>Save</span>
          </b-button>

          <b-button
            variant="danger"
            class="ml-2"
            @click="promptDeleteTag"
          >
            <i class="fas fa-trash-alt fa-fw" aria-hidden />
          </b-button>
        </div>


        <b-card bg-variant="transparent" body-class="pb-3" class="mt-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Games tagged</h2>

          <b-button @click="openGameSelectorSidebar">
            <i class="fa-solid fa-plus" />
          </b-button>
        </div>

        <p v-if="isEmpty">
          No games tagged yet.

          <b-link @click="openGameSelectorSidebar">
            Tag game
          </b-link>
        </p>

        <GameCard
          v-for="gameId in tag.games"
          small
          class="mt-3"
          :key="gameId"
          :game-id="gameId"
        />
      </b-card>
      </form>
    </template>
  </b-sidebar>
</template>

<script>
import VSwatches from 'vue-swatches'
import GameCard from '@/components/GameCard';
import SidebarHeader from '@/components/SidebarHeader';
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
    VSwatches,
    GameCard,
    SidebarHeader,
  },

  computed: {
    ...mapState(['tags', 'cachedGames', 'activeTagIndex']),
    ...mapGetters(['sidebarProps', 'swatchesProps', 'darkTheme']),

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
    this.$bus.$on('SAVE_TAGS', this.selectGame);
    this.load();
  },

  destroyed() {
    this.$bus.$off('SAVE_TAGS', this.selectGame);
  },

  beforeRouteEnter(to, from, next) {
      next(vm => vm.prevRoute = from?.path);
  },

  methods: {
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
      const confirmed = await this.$bvModal.msgBoxConfirm(this.$t('tags.delete.message'), {
        title: this.$t('tags.delete.title'),
        okVariant: 'danger',
        okTitle: this.$t('tags.delete.buttonLabel'),
        cancelTitle: this.$t('global.cancel'),
        headerClass: 'pb-0 border-0',
        footerClass: 'pt-0 border-0',
      });

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
