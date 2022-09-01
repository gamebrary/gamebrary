<template lang="html">
  <b-dropdown right no-caret>
    <template #button-content>
      <i class="fa-solid fa-tags fa-fw" />
    </template>

    <div class="p-2 text-center" v-if="empty">
      <p>No tags available</p>

      <b-button :to="{ name: 'tags' }">
        Manage tags
      </b-button>
    </div>

    <section class="mx-2" v-else-if="game">
      <b-button
        v-for="({ name, bgColor, textColor, games }, index) in tags"
        :key="name"
        rounded
        block
        variant="transparent"
        :style="`background-color: ${bgColor}; color: ${textColor}`"
        @click="handleClick(games.includes(Number(game.id)), index)"
      >
        <i
          v-if="games.includes(Number(game.id))"
          class="fa-solid text-white fa-check bg-success p-1 rounded mr-1"
        />

        {{ name }}
      </b-button>

      <hr />

      <b-button block :to="{ name: 'tags' }">
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
      saving: false,
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

    empty() {
      return Object.keys(this.tags).length === 0;
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
      this.$store.commit('APPLY_TAG_TO_GAME', index);
      this.saving = true;

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {
          this.saving = false;
        });

      this.saving = false;
    },

    async removeTag(index) {
      this.$store.commit('REMOVE_GAME_FROM_TAG', index);

      this.saving = true;

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {
          this.saving = false;
        });

      this.saving = false;
    },
  },
};
</script>
