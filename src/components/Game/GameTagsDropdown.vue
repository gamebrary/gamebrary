<template lang="html">
  <b-dropdown
    right
    no-caret
    variant="light"
    size="sm"
    toggle-class="mr-1 mb-2"
  >
    <template #button-content>
      <i class="fa-solid fa-plus fa-fw" />
      <template v-if="noTagsApplied">Add tag</template>
    </template>

    <div class="p-2 text-center" v-if="isEmpty">
      <p>No tags available</p>

      <b-button :to="{ name: 'tags' }">
        Create tag
      </b-button>
    </div>

    <section class="mx-2" v-else-if="game">
      <small class="d-block mb-2 text-center text-muted">Edit game tags</small>
      <div
        v-for="({ name, bgColor, textColor, games }, index) in tags"
        :key="name"
        style="width: 200px"
        class="d-flex mb-2 align-items-center"
      >
        <b-button
          rounded
          block
          variant="transparent"
          size="sm"
          class="mr-2"
          :style="`background-color: ${bgColor}; color: ${textColor}`"
          :to="{ name: 'tag.edit', params: { id: index } }"
        >
          {{ name }}
        </b-button>

        <b-button
          v-if="games.includes(Number(game.id))"
          size="sm"
          @click="removeTag(index)"
        >
          <i class="fa fa-minus" aria-hidden="true" />
        </b-button>

        <b-button
          v-else
          size="sm"
          @click="addTag(index)"
        >
          <i class="fa fa-plus" aria-hidden="true" />
        </b-button>
      </div>

      <hr />

      <b-button size="sm" block :to="{ name: 'tags' }">
        Manage tags
      </b-button>
    </section>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
    };
  },

  computed: {
    ...mapState(['tags', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    showBackIcon() {
      return this.game?.name.length > 25;
    },

    noTagsApplied() {
      return !this.tags?.some((tag) => tag?.games?.includes(this.game?.id));
    },

    isEmpty() {
      return this.tags.length === 0;
    },

    noneSelected() {
      return !this.formattedTags.some(({ selected }) => Boolean(selected));
    },
  },

  methods: {
    handleClick(selected, index) {
      if (selected) {
        this.removeTag(index);
      } else {
        this.addTag(index);
      }
    },

    async addTag(index) {
      try {
        this.$store.commit('APPLY_TAG_TO_GAME', index);
        await this.$store.dispatch('SAVE_TAGS');
      } catch (e) {}

    },

    async removeTag(index) {
      try {
        this.$store.commit('REMOVE_GAME_FROM_TAG', index);
      } catch (e) {}
    },
  },
};
</script>
