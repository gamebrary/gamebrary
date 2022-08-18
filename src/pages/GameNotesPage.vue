<!-- TODO: finish layout -->
<template lang="html">
  <b-container>
    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else>
      <portal to="pageTitle">
        <div>
          <b-button
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            variant="light"
            class="mr-2"
            >
              <i class="fa-solid fa-chevron-left" />
          </b-button>

          Notes
        </div>
      </portal>

      <portal to="headerActions">
        <b-button
          :to="{ name: 'notes' }"
          variant="light"
          class="mr-2"
        >
          All notes
        </b-button>
      </portal>

      <b-modal id="markdown-cheatsheet">
        <markdown-cheatsheet />
      </b-modal>

      <b-col cols="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded />
        </router-link>
      </b-col>

      <b-col cols="6">
        <div class="note-split">
          <game-note v-if="note" :note="{ note }" />

          <form>
            <b-form-textarea
              v-model.trim="note"
              placeholder="Type note here"
              rows="3"
              max-rows="20"
            />

            <b-form-text id="input-live-help" v-b-modal.markdown-cheatsheet>
              <i class="fab fa-markdown fa-fw" />
              Markdown supported
            </b-form-text>

            <b-modal id="markdown-cheatsheet" title="BootstrapVue">
              <markdown-cheatsheet />
            </b-modal>

            <footer class="mt-2">
              <b-button
                variant="primary"
                :disabled="saving"
                @click="saveNote"
              >
                <b-spinner small v-if="saving" />
                <span v-else>{{ $t('global.save') }}</span>
              </b-button>

              <b-button
                variant="danger"
                class="ml-2"
                v-if="!saving"
                :disabled="deleting"
                @click="deleteNote"
              >
                <b-spinner small v-if="deleting" />
                <i v-else class="fas fa-trash fa-fw" aria-hidden />
              </b-button>
            </footer>

          </form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

import GameNote from '@/components/GameNote';
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
// TODO: consolidate getGameCoverUrl
import { getGameCoverUrl } from '@/utils';

export default {
  components: {
    GameNote,
    MarkdownCheatsheet,
  },

  data() {
    return {
      saving: false,
      note: '',
      loading: false,
      deleting: false,
    };
  },

  computed: {
    ...mapState(['notes', 'game', 'games']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },
  },

  mounted() {
    this.loadGame();
  },

  methods: {
    async loadGame() {
      this.$store.commit('CLEAR_GAME');
      this.loading = true;

      try {
        await this.$store.dispatch('LOAD_GAME', this.$route.params.id);

        this.setNote();
      } catch (e) {}

      this.loading = false;
    },

    setNote() {
      this.note = this.notes[this.$route.params?.id] || '';
    },

    async saveNote() {
      this.saving = true;

      this.$store.commit('SET_GAME_NOTE', { note: this.note, gameId: this.$route.params?.id });

      await this.$store.dispatch('SAVE_NOTES').catch(() => {});

      this.saving = false;

      this.$router.push({
        name: 'game',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    async deleteNote() {
      this.deleting = true;

      this.$store.commit('REMOVE_GAME_NOTE', this.game.id);

      await this.$store.dispatch('SAVE_NOTES_NO_MERGE')
        .catch(() => {
          this.deleting = false;
          this.$bvToast.toast('There was an error deleting your note', { variant: 'danger' });
        });

      this.note = '';

      this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
