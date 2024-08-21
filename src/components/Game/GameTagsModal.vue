<template lang="html">
  <b-sidebar
    scrollable
    right
    shadow
    no-header
    backdrop
    body-class="p-3"
    id="gameTagsModal"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
  >
    <template #default="{ hide }">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h3>Apply tags to {{ game.name }}</h3>
        
        <b-button @click="hide">
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

      <div v-if="isEmpty">
        <p>No tags available</p>

        <b-button :to="{ name: 'tags' }">
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

        <b-button :to="{ name: 'tag.create' }">Create tag</b-button>
      </template>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['tags', 'game']),
    ...mapGetters(['darkTheme']),

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

      this.$store.commit(mutation, Number(this.game?.id));

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