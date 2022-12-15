<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        Edit tag
      </portal>

      <portal to="headerActions">
        <game-selector
          :filter="tag.games"
          title="Tag game"
          variant="primary"
          class="mr-2"
          trigger-text="Tag game"
          @select-game="selectGame"
        />
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <form
        v-else
        class="d-flex align-items-start flex-column"
        @submit.prevent="saveTag"
      >
        <b-form-row>
          <b-col cols="12">
            <div class="field mb-2">
              <b-form-input
                id="tagName"
                v-model.trim="tag.name"
                class="mb-2"
                maxlength="20"
                :placeholder="$t('tags.form.inputPlaceholder')"
                required
                trim
              />

              <v-swatches
                v-model="tag.bgColor"
                v-b-tooltip.hover
                class="mr-2"
                title="Tag background color"
                :trigger-style="{ height: '38px', width: '38px', border: '1px solid #ced4da' }"
                show-fallback
                show-checkbox
                fallback-input-class="color-input float-left"
                fallback-input-type="color"
                :fallback-ok-class="`${darkTheme ? 'bg-secondary text-light' : 'bg-light text-dark'} p-2 float-right`"
                fallback-ok-text="Select"
                popover-x="left"
              />

              <v-swatches
                v-model="tag.textColor"
                v-b-tooltip.hover
                class="mr-2"
                title="Tag text color"
                :trigger-style="{ height: '38px', width: '38px', border: '1px solid #ced4da' }"
                show-fallback
                show-checkbox
                fallback-input-class="color-input float-left"
                fallback-input-type="color"
                :fallback-ok-class="`${darkTheme ? 'bg-secondary text-light' : 'bg-light text-dark'} p-2 float-right`"
                fallback-ok-text="Select"
                popover-x="left"
              />

              <b-button
                v-if="tag.name"
                rounded
                class="float-right"
                variant="transparent"
                :style="`background-color: ${tag.bgColor}; color: ${tag.textColor}`"
              >
                {{ tag.name }}
              </b-button>
            </div>

            <b-button
              :variant="darkTheme ? 'secondary' : 'light'"
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
          </b-col>

          <div class="mt-5" v-if="tag.games.length">
            <h4>Games tagged</h4>

            <b-row>
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
                  fluid
                  @click="$router.push({ name: 'game', params: { id: games[game].id, slug: games[game].slug }})"
                />
              </b-col>
            </b-row>
          </div>
        </b-form-row>
      </form>
    </b-container>
  </section>
</template>

<script>
import VSwatches from 'vue-swatches'
import GameSelector from '@/components/GameSelector';
import { getImageUrl } from '@/utils';
import { mapState, mapGetters } from 'vuex';
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
    ...mapGetters(['darkTheme']),

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

      if (this.tag?.games?.length > 0) {
        await this.$store.dispatch('LOAD_GAMES', this.tag.games);
      }

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

<style>
.color-input {
  height: 38px;
  width: 38px;
  border: 1px solid #ced4da;
  padding: 0;
  background: transparent;
}
</style>
