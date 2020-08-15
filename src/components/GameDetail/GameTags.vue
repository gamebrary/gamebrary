<template lang="html">
  <b-button id="tags-popover" variant="primary">
    <b-icon-tag />

    <b-popover
      target="tags-popover"
      title="Apply tags"
      placement="auto"
    >
      <!-- close on blur -->
      <template v-slot:title>
        <div class="py-0 pr-0 pl-2 d-flex justify-content-between align-items-center">
          Apply tags

          <b-button
            variant="light"
            class="text-muted"
            @click="openTagsSettings"
          >
            <b-icon-gear-fill />
          </b-button>
        </div>
      </template>

      <b-button
        v-for="({ games, hex, tagTextColor }, name) in tags"
        :key="name"
        :style="`background-color: ${hex}; color: ${tagTextColor}`"
        variant="primary"
        size="sm"
        pill
        class="m-1 p-1"
      >
        {{ name }}

        <b-button
          v-if="games.includes(gameId)"
          variant="light"
          size="sm"
          pill
          class="ml-1 mr-0 p-1"
          @click="removeTag(name)"
        >
          <b-icon-x />
        </b-button>

        <b-button
          v-else
          size="sm"
          pill
          class="ml-1 mr-0 p-1"
          @click="addTag(name)"
        >
          <b-icon-plus />
        </b-button>
      </b-button>
    </b-popover>
  </b-button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    gameId: Number,
  },

  computed: {
    ...mapGetters(['gameTags']),
    ...mapState(['tags', 'games']),
  },

  methods: {
    openTagsSettings() {
      this.$bvModal.show('tags-settings');
    },

    addTag(tagName) {
      const { gameId } = this;

      this.$store.commit('ADD_GAME_TAG', { tagName, gameId });
      this.saveTags();
    },

    removeTag(tagName) {
      const { gameId } = this;

      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId });
      this.saveTags();
    },

    async saveTags() {
      await this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('Tags updated', { title: 'Success', variant: 'success' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag {
  margin-right: .5rem;
}
</style>
