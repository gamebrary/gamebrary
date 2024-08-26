<template lang="html">
  <b-sidebar
    id="gameTagsModal"
    v-bind="sidebarProps"
    right
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        Apply tags to {{ game.name }}
      </SidebarHeader>

      <div class="p-3">
        <div v-if="isEmpty">
          <p>No tags available</p>

          <b-button v-b-toggle.create-tag-sidebar>
            Create tag
          </b-button>
        </div>

        <template v-else>
          <div
            v-for="({ name, bgColor, textColor, games }, index) in tags"
            :key="index"
            class="tag mb-2"
          >
            <b-button
              v-if="name"
              rounded
              variant="transparent"
              class="text-left"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              @click="openEditTagSidebar(index)"
            >
              <b-badge>{{ games.length }}</b-badge>
              {{ name }}
            </b-button>

            <b-button
              v-if="games"
              @click="selectTag(index, games)"
              :variant="games.includes(Number(game.id)) ? 'danger' : 'light'"
            >
              <i
                v-if="games.includes(Number(game.id))"
                class="fa fa-trash"
                aria-hidden="true"
              />
              <i v-else class="fa fa-plus" aria-hidden="true" />
            </b-button>
          </div>

          <div class="d-flex align-items-center justify-content-between">
            <b-button v-b-toggle.create-tag-sidebar>Create new tag</b-button>
          </div>
        </template>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SidebarHeader from '@/components/SidebarHeader';

export default {
  components: {
    SidebarHeader,
  },

  computed: {
    ...mapState(['tags', 'game']),
    ...mapGetters(['sidebarProps']),

    isEmpty() {
      return this.tags.length === 0 || !this.game;
    },
  },

  methods: {
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