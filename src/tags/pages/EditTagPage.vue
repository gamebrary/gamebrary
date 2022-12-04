<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        Edit tag
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <b-form-row v-else>
        <b-col cols="12">
          <form @submit.prevent="saveTag" class="d-flex align-items-start">
            <div>
              <b-form-input
                id="tagName"
                v-model.trim="tag.name"
                class="field mr-2 mb-2"
                maxlength="20"
                :placeholder="$t('tags.form.inputPlaceholder')"
                required
                trim
              />

              <b-button
                v-if="tag.name"
                rounded
                variant="transparent"
                :style="`background-color: ${tag.bgColor}; color: ${tag.textColor}`"
              >
                {{ tag.name }}
              </b-button>
            </div>

            <v-swatches
              v-model="tag.bgColor"
              v-b-tooltip.hover
              class="mr-2"
              title="Tag background color"
              show-fallback
              show-checkbox
              fallback-input-class="bg-danger"
              fallback-input-type="color"
              fallback-ok-class="bg-dark p-2"
              fallback-ok-text="Select"
              popover-x="left"
            />

            <v-swatches
              v-model="tag.textColor"
              v-b-tooltip.hover
              class="mr-2"
              title="Tag text color"
              show-fallback
              popover-x="left"
            />

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

          <hr class="my-2" />
        </b-col>

        <b-col cols="12">
          <header class="d-flex justify-content-between align-items-center mb-2">
            <h4>Games tagged</h4>

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
        </b-col>

        <b-col
          v-for="game in tag.games"
          :key="game"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <b-img
            :src="$options.getImageUrl(games[game], $options.IMAGE_SIZE_COVER_SMALL)"
            class="cursor-pointer rounded mb-2"
            fluid-grow
            @click="$router.push({ name: 'game', params: { id: games[game].id, slug: games[game].slug }})"
          />
        </b-col>
      </b-form-row>
    </b-container>
  </section>
</template>

<script>
import VSwatches from 'vue-swatches'
import GameSelector from '@/components/GameSelector';
import { getImageUrl } from '@/utils';
import { mapState } from 'vuex';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,

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
