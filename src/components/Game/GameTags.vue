<template lang="html">
  <b-dropdown-item v-b-modal.tags>
    <i class="far fa-tags fa-fw" /> Tags

    <b-modal
      id="tags"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Tags"
          @close="close"
        />
      </template>

      <b-list-group>
        <div v-if="empty">
          <b-alert show class="mb-2">
            No tags
          </b-alert>
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
            <i class="fas fa-minus fa-fw" aria-hidden />
          </b-button>

          <b-button
            v-else
            variant="outline-success"
            size="sm"
            @click="addTag(name)"
          >
            <i class="fas fa-plus fa-fw" />
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    ...mapState(['tags']),
    ...mapGetters(['nightMode']),

    empty() {
      return Object.keys(this.tags).length === 0;
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
  },
};
</script>
