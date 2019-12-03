<template lang="html">
  <modal
    ref="tag"
    :title="$t('tags.editTags' )"
    :message="$t('tags.message', { gameName: game && game.name })"
  >
    <div slot="content" class="game-tags">
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

      <div class="settings-message">
        <p>{{ $t('tags.settingsMessage') }}</p>
        <settings />
      </div>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';
import Settings from '@/pages/Settings';

export default {
  components: {
    Tag,
    Modal,
    Settings,
  },

  data() {
    return {
      gameTagsId: null,
    };
  },

  computed: {
    ...mapState(['tags', 'platform', 'game']),
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
      this.saveTags();
    },

    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameTagsId });
      this.saveTags();
    },

    async saveTags() {
      await this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your tag', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'Tags updated' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '~styles/styles';

h3 {
  margin: $gp 0;
}

.game-tags {
}

.tag {
  margin-right: $gp / 2;
}

.settings-message {
  margin-top: $gp * 3;
  border-top: 1px solid var(--modal-text-color);
  display: flex;
  align-items: center;
  padding-top: $gp;

  @media($small) {
    padding: $gp;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
    width: 100%;
  }

  p {
    margin: 0 $gp 0 0;
  }
}
</style>
