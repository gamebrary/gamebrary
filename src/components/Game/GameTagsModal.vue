<template lang="html">
  <b-modal
    id="tags"
    size="sm"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Tags"
        :subtitle="game.name"
        @close="close"
      >
        <template v-slot:header>
          <b-img
            :src="activeGameCoverUrl"
            :alt="game.name"
            class="float-left mr-2"
            height="40"
            rounded
          />
        </template>
      </modal-header>
    </template>

    <empty-state
      v-if="empty"
      class="mb-4"
      message="Looks like you don't have any tags yet."
    >
      <b-button @click="manageTags">Manage tags</b-button>
    </empty-state>

    <template v-else>
      <p>Click on tag to add or remove tag from game</p>

      <b-list-group>
        <b-list-group-item
          v-for="({ games, hex, tagTextColor }, name) in sortedTags"
          :key="name"
          class="d-flex justify-content-between"
          button
          :variant="games.includes(game.id) ? 'success' : ''"
          @click="games.includes(game.id) ? removeTag(name) : addTag(name)"
        >
          <b-badge
            pill
            tag="small"
            class="mr-3"
            :style="`background-color: ${hex}; color: ${tagTextColor}`"
          >
            {{ name }}
          </b-badge>

          <b-badge variant="light">{{ games.length }} games</b-badge>
        </b-list-group-item>
      </b-list-group>
    </template>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

  props: {
    game: Object,
  },

  computed: {
    ...mapState(['tags']),
    ...mapGetters(['nightMode', 'activeGameCoverUrl']),

    empty() {
      return Object.keys(this.tags).length === 0;
    },

    sortedTags() {
      return Object.keys(this.tags)
        .sort()
        // eslint-disable-next-line
        .reduce((res, key) => (res[key] = this.tags[key], res), {});
    },
  },

  methods: {
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

    manageTags() {
      this.$bvModal.hide('tags');
      this.$bvModal.hide('game-modal');
      this.$router.push({ name: 'tags' });
    },
  },
};
</script>
