<template lang="html">
  <div class="game-tags">
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
    ...mapGetters(['hasTags']),
    ...mapState(['tags', 'games', 'game']),
  },

  methods: {
    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.game.id });
      this.$bus.$emit('SAVE_TAGS', this.tags);
    },

    openTags() {
      this.$bus.$emit('OPEN_TAGS', this.game.id);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '~styles/styles';

.game-tags {
  margin: $gp / 2 0 $gp;
}

.tag {
  margin-right: $gp / 2;
}
</style>
