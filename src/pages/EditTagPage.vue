<!-- TODO: use getter to get tags with game info added to it -->
<template lang="html">
  <b-container>
    <portal to="pageTitle">
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
        variant="danger"
        class="mr-2"
        @click="promptDeleteTag(tag.name)"
      >
        <i class="fas fa-trash-alt fa-fw" aria-hidden />
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else>
      <b-col>
        <form
          class="field centered"
          @submit.prevent="saveTag"
        >
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
            v-model="tag.bgColor"
            show-fallback
            popover-x="left"
          />
          <p>Text color</p>

          <v-swatches
            v-model="tag.textColor"
            show-fallback
            popover-x="left"
          />

          <p>Preview</p>

          <b-button
            v-if="tag.name"
            rounded
            size="sm"
            class="mr-2 mb-4"
            variant="transparent"
            :style="`background-color: ${tag.bgColor}; color: ${tag.textColor}`"
          >
            {{ tag.name }}
          </b-button>

          <hr />
          <!-- TODO: Put games tagged in collapsible and lazy load images -->

          <b-button
            variant="primary"
            :disabled="saving"
            type="submit"
          >
            <b-spinner small v-if="saving" />
            <span v-else>Save</span>
          </b-button>

          <hr />

          <p>Games tagged</p>

          <!-- TODO: add quick game picker -->
          <b-alert :show="tag.games.length === 0" variant="light" class="field">
            No games tagged
          </b-alert>

          <b-img
            v-for="game in tag.games"
            :key="game"
            :src="getCoverUrl(game)"
            class="cursor-pointer rounded mr-2 mb-2"
            width="80"
            @click="$router.push({ name: 'game.tags', params: { id: games[game].id, slug: games[game].slug }})"
          />
        </form>
      </b-col>
    </b-row>
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
      saving: false,
    }
  },

  components: {
    VSwatches,
  },

  computed: {
    ...mapState(['tags', 'games']),

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
      // TODO: call mutation to remove tag and save tags
      // this.saveTags(true);
    },

    async saveTag() {
      this.saving = true;
      const { tag, tagIndex } = this;
      this.$store.commit('UPDATE_TAG', { tagIndex, tag });

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {});

      this.saving = false;
      this.$router.push({ name: 'tags' })
    },
  },
};
</script>
