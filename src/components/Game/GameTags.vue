<template lang="html">
  <b-button
    id="tags-popover"
    variant="primary"
    v-b-tooltip.hover
    title="Apply tags"
   >
    <b-icon-tag />

    <b-popover
      target="tags-popover"
      title="Apply tags"
      placement="auto"
      triggers="click blur"
    >
      <template v-slot:title>
        <div class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center">
          Apply tags

          <b-button
            variant="light"
            class="text-muted ml-4"
            size="sm"
            @click="openTagsSettings"
          >
            <b-icon-gear-fill />
          </b-button>
        </div>
      </template>

      <b-list-group>
        <div v-if="empty">
          <b-alert show class="mb-2">
            No tags
          </b-alert>

          <b-button
            size="sm"
            variant="primary"
            @click="openTagsSettings"
          >
            Add a tag
          </b-button>
        </div>

        <b-list-group-item
          v-for="({ games, hex, tagTextColor }, name) in tags"
          :key="name"
          class="p-2 d-flex align-items-center justify-content-between"
        >
          <b-badge
            pill
            tag="small"
            class="mr-3"
            :style="`background-color: ${hex}; color: ${tagTextColor}`"
          >
            {{ name }}
          </b-badge>

          <b-button
            v-if="games.includes(game.id)"
            variant="outline-danger"
            size="sm"
            @click="removeTag(name)"
          >
            <b-icon-trash />
          </b-button>

          <b-button
            v-else
            variant="outline-success"
            size="sm"
            @click="addTag(name)"
          >
            <b-icon-plus font-scale="1" />
          </b-button>

        </b-list-group-item>
      </b-list-group>
    </b-popover>
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    ...mapState(['tags']),

    empty() {
      return Object.keys(this.tags).length === 0;
    },
  },

  methods: {
    openTagsSettings() {
      this.$bvModal.show('tags-settings');
    },

    async addTag(tagName) {
      const gameId = this.game.id;

      this.$store.commit('ADD_GAME_TAG', { tagName, gameId });
      await this.saveTags();

      this.$bvToast.toast(`Tag "${tagName}" added`, { title: this.game.name, variant: 'success' });
    },

    async removeTag(tagName) {
      const gameId = this.game.id;

      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId });
      await this.saveTags();

      this.$bvToast.toast(`Tag "${tagName}" removed`, { title: this.game.name, variant: 'success' });
    },

    saveTags() {
      this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },
  },
};
</script>
