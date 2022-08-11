<template lang="html">
  <b-container fluid>
    <portal to="headerTitle">
      <div>
        <b-button
          variant="light"
          class="mr-2"
          :to="{ name: 'tags' }"
        >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Edit tag
      </div>
    </portal>


    <portal to="headerActions">
      <b-button
        variant="light"
        class="mr-2"
        @click="promptDeleteTag(tag.name)"
      >
        <i class="fas fa-trash-alt fa-fw" aria-hidden />
      </b-button>
    </portal>

    <div v-if="loading" class="text-center mt-5 ml-auto">
      <b-spinner/>
    </div>

    <form
      v-else
      ref="form"
      @submit="saveTag"
    >
      <b-alert
        class="mt-3 mb-0"
        :show="isEditedNameDuplicate && !saving"
        variant="warning"
      >
        You already have a tag named <strong>{{ tag.name }}</strong>
      </b-alert>

      <label for="tagName">Tag name:</label>

      <b-form-input
        id="tagName"
        v-model.trim="tag.name"
        class="mb-3 field"
        maxlength="20"
        :placeholder="$t('tags.form.inputPlaceholder')"
        required
        trim
      />

      <p>Background color</p>

      <v-swatches
        v-model="tag.hex"
        show-fallback
        popover-x="left"
      />

      <p>Text color</p>

      <v-swatches
        v-model="tag.tagTextColor"
        show-fallback
        popover-x="left"
      />

      <p>Preview</p>

      <b-button
        v-if="tag.name"
        rounded
        block
        size="sm"
        class="mr-2 mb-2 field"
        variant="outline-light"
        :style="`background-color: ${tag.hex}; color: ${tag.tagTextColor}`"
      >
        {{ tag.name }}
      </b-button>

      <hr />

      <p>Games tagged</p>

      <div class="tagged-games">
        <b-img
          v-for="game in tag.games"
          :key="game"
          :src="getCoverUrl(game)"
          class="cursor-pointer"
          thumbnail
          @click="$router.push({ name: 'game', params: { id: games[game].id, slug: games[game].slug }})"
        />
      </div>

      <hr />

      <b-button
        variant="primary"
        :disabled="isEditedNameDuplicate || saving"
        type="submit"
      >
        <b-spinner small v-if="saving" />
        <span v-else>Save</span>
      </b-button>
    </form>
  </b-container>
</template>

<script>
import VSwatches from 'vue-swatches'
import { mapState } from 'vuex';

export default {
  data() {
    return {
      tag: {},
      loading: true,
      originalTagName: '',
      localTags: {},
      saving: false,
    }
  },

  components: {
    VSwatches,
  },

  computed: {
    ...mapState(['tags', 'games']),

    tagNames() {
      const sanitizedNames = this.tags?.map(({ name }) => name.toLowerCase());

      return sanitizedNames.length > 0
        ? sanitizedNames.filter(name => name?.toLowerCase() !== this.originalTagName?.toLowerCase())
        : [];
    },

    isEditedNameDuplicate() {
      return this.tagNames?.includes(this.tag?.name?.toLowerCase());
    },

    tagIndex() {
      return this.$route?.params?.id;
    },
  },

  async mounted() {
    this.load();
  },

  methods: {
    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game?.cover?.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },

    async load() {
      this.loading = true;
      await this.$store.dispatch('LOAD_TAGS');

      const { tags, tagIndex } = this;

      this.tag = JSON.parse(JSON.stringify(tags[tagIndex]));
      this.originalTagName = JSON.parse(JSON.stringify(this.tag.name));

      this.loading = false;
    },

    promptDeleteTag(tagName) {
      this.$bvModal.msgBoxConfirm(this.$t('tags.delete.message'), {
        title: this.$t('tags.delete.title'),
        okVariant: 'danger',
        okTitle: this.$t('tags.delete.buttonLabel'),
        cancelTitle: this.$t('global.cancel'),
        headerClass: 'pb-0 border-0',
        footerClass: 'pt-0 border-0',
      })
        .then((value) => {
          if (value) {
            this.deleteTag(tagName);
          }
        });
    },

    deleteTag(tagName) {
      this.$delete(this.localTags, tagName);
      this.saveTags(true);
    },

    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameId });
      this.saveTags();
    },

    async saveTag(e) {
      e.preventDefault();

      if (this.$refs.form.checkValidity()) {
        const { tag, tags, originalTagName } = this;

        tags[this.tagIndex] = tag;

        console.log(tags);

        // await this.$store.dispatch('SAVE_TAGS', tags)
        //   .catch(() => {
        //     this.$store.commit('SET_SESSION_EXPIRED', true);
        //   });
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tagged-games {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(80px, 1fr));
  grid-auto-flow: column;
  grid-auto-columns: minmax(80px, 1fr);
  grid-gap: .5rem;
  overflow-x: auto;
  max-width: calc(100vw - 32px);
}
</style>
