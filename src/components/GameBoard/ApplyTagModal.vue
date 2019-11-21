<template lang="html">
  <modal
    ref="tag"
    :title="$t('tags.applyTag')"
    :message="$t('tags.message')"
  >
    <div slot="content">
      <h3>All tags</h3>

      <tag
        v-for="(tag, name) in tags"
        v-if="!tag.platform"
        :key="name"
        :label="name"
        :hex="tag.hex"
        :text-hex="tag.tagTextColor"
        :readonly="!tag.games.includes(gameTagsId)"
        @action="tryAdd(tag.games, name)"
        @close="removeTag(name)"
      />

      <h3>{{ platform.name }} tags</h3>

      <tag
        v-for="(tag, name) in tags"
        v-if="tag.platform && tag.platform === platform.id"
        :key="name"
        :label="name"
        :hex="tag.hex"
        :text-hex="tag.tagTextColor"
        :readonly="!tag.games.includes(gameTagsId)"
        @action="tryAdd(tag.games, name)"
        @close="removeTag(name)"
      />
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';

export default {
  components: {
    Tag,
    Modal,
  },

  data() {
    return {
      gameTagsId: null,
    };
  },

  computed: {
    ...mapState(['tags', 'platform']),
  },

  mounted() {
    this.$bus.$on('OPEN_TAGS', this.openTags);
  },

  beforeDestroy() {
    this.$bus.$off('OPEN_TAGS');
  },

  methods: {
    openTags(id) {
      this.gameTagsId = id;
      this.$refs.tag.open(id);
    },

    tryAdd(games, tagName) {
      if (!games.includes(this.gameTagsId)) {
        this.addTag(tagName);
      }
    },

    addTag(tagName) {
      this.$store.commit('ADD_GAME_TAG', { tagName, gameId: this.gameTagsId });
      this.$bus.$emit('SAVE_TAGS', this.tags);
    },

    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameTagsId });
      this.$bus.$emit('SAVE_TAGS', this.tags);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '~styles/styles';

h3 {
  margin: $gp 0;
}

.tag {
  margin-right: $gp / 2;
}
</style>
