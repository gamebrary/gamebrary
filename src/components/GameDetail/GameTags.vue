<template lang="html">
  <div class="game-tags">
    <!-- TODO: use array function to filter out tags -->
    <tag
      v-for="({ games, hex, tagTextColor }, name) in tags"
      v-if="game && games.includes(game.id)"
      :key="name"
      :label="name"
      :hex="hex"
      :text-hex="tagTextColor"
      readonly
      @action="openTags"
      @close="removeTag(name)"
    />
  </div>
</template>

<script>
import Tag from '@/components/Tag';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    Tag,
  },

  computed: {
    ...mapGetters(['gameTags']),
    ...mapState(['tags', 'games', 'game']),
  },

  methods: {
    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.game.id });
      this.saveTags();
    },

    openTags() {
      this.$bus.$emit('OPEN_TAGS', this.game.id);
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
