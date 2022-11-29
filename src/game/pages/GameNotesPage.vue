<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <b-row v-else>
        <portal to="pageTitle">
          <div>
            <b-button
              v-if="game"
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

        <b-col cols="12" sm="6">
          <div ref="editor" />

          <game-note
            v-if="showPreview"
            :note="{ note }"
            class="mt-3 mt-sm-0"
          />

          <router-link
            v-else-if="game"
            :to="{ name: 'game', params: { id: game.id, slug: game.slug }}"
            class="float-right"
          >
            <b-img :src="$options.getImageUrl(game.cover.image_id, 't_cover_small_2x')" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="12" sm="6">
          <form class="mt-3 mt-sm-0 mb-3 field">
            <b-form-textarea
              v-model.trim="note"
              placeholder="Type note here"
              rows="3"
              max-rows="20"
            />

            <b-link
              class="small"
              variant="link"
              v-b-modal.markdown-cheatsheet
            >
              <i class="fab fa-markdown fa-fw" />
              Markdown supported
            </b-link>

            <footer class="mt-2 d-flex">
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

              <b-button
                variant="light"
                class="ml-auto"
                @click="showPreview = !showPreview"
              >
                <i class="fas fa-eye fa-fw" aria-hidden />
                Toggle preview
              </b-button>
            </footer>
          </form>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import GameNote from '@/components/GameNote';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameNote,
  },

  data() {
    return {
      saving: false,
      note: '',
      loading: false,
      deleting: false,
      showPreview: false,
    };
  },

  computed: {
    ...mapState(['notes', 'game', 'games']),
  },

  mounted() {
    this.loadGame();
  },

  methods: {
    async loadGame() {
      const gameCached = this.game?.id == this.$route?.params?.id;

      if (!gameCached) {
        this.$store.commit('CLEAR_GAME');
        this.loading = true;

        try {
          await this.$store.dispatch('LOAD_GAME', this.$route.params.id);

          this.setNote();
        } catch (e) {}
      } else {
        this.setNote();
      }

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
