<template lang="html">
  <b-button id="tags-popover" variant="primary">
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
            v-if="games.includes(gameId)"
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
