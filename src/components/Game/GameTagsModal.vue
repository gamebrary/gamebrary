<template lang="html">
  <b-modal
    id="gameTagsModal"
    hide-footer
    centered
    :header-bg-variant="darkTheme ? 'dark' : 'white'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'white'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
    size="sm"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit tags"
        :subtitle="game.name"
        @close="close"
      />
    </template>

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
          :to="{ name: 'tag.edit', params: { id: index } }"
          :style="`background-color: ${bgColor}; color: ${textColor}`"
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
  </b-modal>
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

      this.$store.commit(mutation, { tagIndex, gameId: Number(this.game?.id) });

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});
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