<!-- TODO: finish layout -->
<template lang="html">
<<<<<<< Updated upstream
  <b-container fluid class="p-2">
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'settings' }"
          variant="light"
          class="mr-2"
          >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Notes
      </div>
    </portal>

    <div v-if="loading">
      Loading...
    </div>

    <b-row>
      <b-col cols="6">
        <b-img
          v-if="game && game.id"
          :src="getCoverUrl(game.id)"
          class="cursor-pointer"
          thumbnail
          @click="selectedNote = filteredNotes[index]"
        />
=======
  <b-container fluid>
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
>>>>>>> Stashed changes
      </b-col>

      <b-col>
        <game-note v-if="note" :note="{ note }" />

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          class="mr-1"
=======
          class="ml-2"
>>>>>>> Stashed changes
          v-if="notes[game.id] && !saving"
          :disabled="deleting"
          @click="deleteNote"
        >
          <b-spinner small v-if="deleting" />

          <i class="d-sm-none fas fa-trash fa-fw" aria-hidden />
          <span class="d-none d-sm-inline">{{ $t('global.delete') }}</span>
        </b-button>
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
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
      deleting: false,
    };
  },

  computed: {
    ...mapState(['notes', 'game', 'games']),

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
    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/no-image.jpg';
    },

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
