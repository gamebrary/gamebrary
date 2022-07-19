<!-- TODO: finish layout -->
<template lang="html">
  <b-container fluid class="p-2">
    <div v-if="loading">
      Loading...
    </div>

    <b-form-row v-else>
      <b-col>
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
          <b-img :src="gameCoverUrl" width="200" rounded class="mb-2 mr-2" />
        </router-link>

        <b-button
          variant="primary"
          :disabled="saving || !dirtied"
          @click="saveNote"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>

        <b-button
          variant="danger"
          class="mr-1"
          v-if="notes[game.id] && !saving"
          :disabled="deleting"
          @click="deleteNote"
        >
          <b-spinner small v-if="deleting" />

          <i class="d-sm-none fas fa-trash fa-fw" aria-hidden />
          <span class="d-none d-sm-inline">{{ $t('global.delete') }}</span>
        </b-button>

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
      </b-col>

      <b-col>
        <game-note v-if="note" :note="{ note }" />
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

import GameNote from '@/components/GameNote';
import MarkdownCheatsheet from '@/components/MarkdownCheatsheet';
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
      deleting: false,
    };
  },

  computed: {
    ...mapState(['notes', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    dirtied() {
      return this.note !== this.notes[this.game.id];
    },
  },

  mounted() {
    this.loadNote();
  },

data() {
  return {
    loading: true,
  }
},

  methods: {
    loadNote() {
      if (this.game.id !== this.$route.params.id) {
        this.loadGame();
      } else {
        this.loading = false;
        this.setNote();
      }
    },

    async loadGame() {
      this.loading = true;
      this.$store.commit('CLEAR_GAME');

      try {
        await this.$store.dispatch('LOAD_GAME', this.$route.params.id);

        this.setNote();
      } catch (e) {}

      this.loading = false;
    },

    setNote() {
      this.note = this.notes[this.game.id] || '';
    },

    async saveNote() {
      this.saving = true;

      await this.$store.dispatch('SAVE_NOTES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your note', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Note saved');
      this.$store.commit('SET_GAME_NOTE', {
        note: this.note,
        gameId: this.game.id,
      });

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
      this.$bvToast.toast('Note deleted');

      this.$router.push({
        name: 'game',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
