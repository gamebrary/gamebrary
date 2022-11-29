<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        Edit tag
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <b-row v-else>
        <b-col cols="12" sm="6">
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

            <b-button
              variant="primary"
              :disabled="saving"
              type="submit"
            >
              <b-spinner small v-if="saving" />
              <span v-else>Save</span>
            </b-button>

            <b-button
              variant="danger"
              class="ml-2"
              @click="promptDeleteTag"
            >
              <i class="fas fa-trash-alt fa-fw" aria-hidden />
            </b-button>
          </form>
        </b-col>

        <b-col cols="12" sm="6">
          <header class="d-flex justify-content-between">
            <p>Games tagged</p>

            <game-selector
              :filter="tag.games"
              title="Tag game"
              trigger-text="Tag game"
              @select-game="selectGame"
            />
          </header>

          <b-alert :show="tag.games.length === 0" variant="light" class="field">
            No games tagged
          </b-alert>

          <b-img
            v-for="game in tag.games"
            :key="game"
            :src="$options.getImageUrl(games[game].cover.image_id, 't_cover_small_2x')"
            class="cursor-pointer rounded mr-2 mb-2"
            @click="$router.push({ name: 'game', params: { id: games[game].id, slug: games[game].slug }})"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import VSwatches from 'vue-swatches'
import GameSelector from '@/components/GameSelector';
import { getImageUrl } from '@/utils';
import { mapState } from 'vuex';

export default {
  getImageUrl,

  data() {
    return {
      tag: {},
      loading: true,
      saving: false,
      prevRoute: null,
    }
  },

  components: {
    VSwatches,
    GameSelector,
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

  beforeRouteEnter(to, from, next) {
      next(vm => vm.prevRoute = from?.path);
  },

  methods: {
    async selectGame(gameId) {
      const { tagIndex, tags } = this;

      this.$store.commit('APPLY_TAG_TO_GAME', { tagIndex, gameId });

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});
      await this.$store.dispatch('LOAD_GAMES', [gameId]);

      this.tag = JSON.parse(JSON.stringify(tags[tagIndex]));
    },

    async load() {
      this.loading = true;
      await this.$store.dispatch('LOAD_TAGS');

      const { tags, tagIndex } = this;

      this.tag = JSON.parse(JSON.stringify(tags[tagIndex]));

      await this.$store.dispatch('LOAD_GAMES', this.tag.games);

      this.loading = false;
    },

    async promptDeleteTag() {
      const confirmed = await this.$bvModal.msgBoxConfirm(this.$t('tags.delete.message'), {
        title: this.$t('tags.delete.title'),
        okVariant: 'danger',
        okTitle: this.$t('tags.delete.buttonLabel'),
        cancelTitle: this.$t('global.cancel'),
        headerClass: 'pb-0 border-0',
        footerClass: 'pt-0 border-0',
      });

      if (confirmed) this.deleteTag();
    },

    async deleteTag() {
      this.$store.commit('REMOVE_TAG', this.tagIndex);

      await this.$store.dispatch('SAVE_TAGS').catch(() => {});

      this.$router.replace({ name: 'tags' });
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
